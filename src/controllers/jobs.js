const {Op} = require("sequelize");

class JobsController {
    async findUnpaid(req, res) {
        const {Job, Contract} = req.app.get('models')

        const jobs = await Job.findAndCountAll({
            where: {
                paid: {
                    [Op.or]: [null, 0]
                },
            },
            include: [
                {
                    model: Contract,
                    alias: 'Contract',
                    where: {
                        [Op.or]: {
                            ClientId: req.profile.id,
                            ContractorId: req.profile.id,
                        },
                        status: {
                            [Op.in]: ['new', 'in_progress']
                        }
                    },
                    required: true,
                    attributes: [] // Remove contract info
                }
            ]
        })

        if (!jobs) return res.status(404).end()
        return res.json(jobs)
    }

    async findById(req, res) {
        return false
    };
}

module.exports = new JobsController()