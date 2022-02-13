const {Op} = require("sequelize");
const {sequelize} = require("../model");
const TAX_FEE = 0.25;

class BalancesController {

    async createDeposit(req, res) {
        const {Job, Contract, Profile} = req.app.get('models');
        const profile = await Profile.findByPk(req.params.userId);

        if (!profile) {
            return res.status(404).end();
        }

        if (profile.type !== 'client') {
            return res.status(400).json({
                message: `You don't have the rights to execute this operation.`
            })
        }

        // Fetch all jobs that are pending payment.
        const clientJobs = await Job.findAll({
            where: {
                paid: {
                    [Op.or]: [null, 0, false]
                },
            },
            include: [
                {
                    model: Contract,
                    where: {
                        status: {
                            [Op.in]: ['new', 'in_progress']
                        },
                        ClientId: profile.id
                    },
                    required: true,
                    attributes: []
                }
            ],
        })

        // Sum all jobs price.
        const amountJobsToPay = clientJobs.map(job => job.price).reduce((prev, current) => prev + current, 0)

        const allowedDepositFee = amountJobsToPay * TAX_FEE;

        if (req.body.credit > allowedDepositFee) {
            return res.status(400).json({
                message: `You cannot deposit more than 25% of your current pending jobs. You're allowed to deposit ${allowedDepositFee}.`,
                amountJobsToPay,
                depositCut: allowedDepositFee
            })
        }

        profile.balance += req.body.credit;
        await profile.save();

        return res.json({
            message: 'The deposit has been created successfully'
        })
    };

}

module.exports = new BalancesController()