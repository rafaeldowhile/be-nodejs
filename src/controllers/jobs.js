const {Op} = require("sequelize");
const moment = require("moment");
const BaseController = require("./base");

class JobsController extends BaseController {

    findUnpaidJobs = async (req, res) => {
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

        if (!jobs) return this.notFound("Jobs not found")

        return res.json(jobs)
    }

    payJob = async (req, res) => {
        const profile = req.profile;

        if (profile.type !== 'client') {
            return this.notAuthorized(res, `You don't have the rights to execute this operation.`)
        }

        const {Job, Contract, Profile} = req.app.get('models');

        const job = await Job.findByPk(req.params.job_id, {
            where: {
                paid: {
                    [Op.or]: [null, 0]
                },
            },
            include: [
                {
                    model: Contract,
                    where: {
                        ClientId: profile.id,
                        status: {
                            [Op.or]: ['new', 'in_progress']
                        }
                    },
                    required: true
                }
            ]
        })

        if (!job) {
            return this.notFound(res, "Job not found")
        }

        const contractor = await Profile.findOne({where: {id: job.Contract.ContractorId}});

        if (profile.balance < job.price) {
            return this.applicationError(res, `You don't have enough credits to execute this operation.`)
        }

        profile.balance -= job.price;
        contractor.balance += job.price;
        job.paid = true;
        job.paymentDate = moment();

        await profile.save();
        await job.save();
        await contractor.save();

        return res.json({
            message: 'Job paid successfully'
        })
    };
}

module.exports = new JobsController()