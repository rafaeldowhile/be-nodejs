const {Op} = require("sequelize");
const moment = require("moment");
const {sequelize} = require("../model");

class AdminController {

    constructor() {
    }

    prepareDates = (query, res) => {
        let {start, end} = query;

        const isStartValid = moment(start, 'MM-DD-YYYY', true).isValid();
        const isEndValid = moment(end, 'MM-DD-YYYY', true).isValid();

        if (!isStartValid || !isEndValid) {
            return res.status(400).json({
                message: 'Please provide the start and end dates in the following MM-DD-YYYY.'
            })
        }

        start = moment(start, 'MM-DD-YYYY');
        end = moment(end, 'MM-DD-YYYY');

        if (end < start) {
            return res.status(400).json({
                message: 'Wrong dates.'
            })
        }

        start.startOf('day');
        end.endOf('day');

        return {
            start: start.format('YYYY-MM-DD HH:mm'),
            end: end.format('YYYY-MM-DD HH:mm')
        }
    }

    getBestProfession = async (req, res) => {

        const {start, end} = this.prepareDates(req.query, res);
        const {Job, Contract, Profile} = req.app.get('models');

        const result = await Job.findOne({
            where: {
                paid: true,
                paymentDate: {
                    [Op.between]: [start, end]
                }
            },
            include: [
                {
                    model: Contract,
                    as: 'Contract',
                    required: true,
                    attributes: [],
                    include: [
                        {
                            model: Profile,
                            as: 'Contractor',
                            where: {
                                type: 'contractor'
                            },
                            attributes: []
                        },
                    ]
                }
            ],
            raw: true,
            group: ['Contract.Contractor.profession'],
            attributes: ['Contract.Contractor.profession', [sequelize.fn('sum', sequelize.col('price')), 'amount']],
            order: [[sequelize.col('amount'), 'DESC']]
        })

        return res.json(result);
    }

    getBestClients = async (req, res) => {

        const {start, end} = this.prepareDates(req.query, res);
        const limit = req.query.limit || 2;
        const {Job, Contract, Profile} = req.app.get('models');

        let result = await Job.findAll({
            where: {
                paid: true,
                paymentDate: {
                    [Op.between]: [start, end]
                }
            },
            include: [
                {
                    model: Contract,
                    as: 'Contract',
                    required: true,
                    attributes: [],
                    include: [
                        {
                            model: Profile,
                            as: 'Client',
                            where: {
                                type: 'client'
                            },
                            attributes: []
                        },
                    ]
                }
            ],
            raw: true,
            group: ['Contract.Client.id'],
            attributes: ['Contract.Client.id', 'Contract.Client.firstName', 'Contract.Client.lastName', [sequelize.fn('sum', sequelize.col('price')), 'paid']],
            order: [[sequelize.col('paid'), 'DESC']],
            limit: limit
        })

        result = result.map(item => {
            item.fullName = [item.firstName, item.lastName].join(' ');

            delete item.firstName;
            delete item.lastName;

            return item
        })

        return res.json(result);
    };
}

module.exports = new AdminController();