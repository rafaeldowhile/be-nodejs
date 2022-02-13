const {Op} = require("sequelize");

class ContractController {
    async findAll(req, res) {
        const {Contract, Profile} = req.app.get('models')
        const contract = await Contract.findAndCountAll({
            where: {
                status: {
                    [Op.in]: ['new', 'in_progress']
                }
            },
            include: [
                {
                    model: Profile,
                    as: 'Client',
                    where: {
                        id: req.profile.id
                    },
                    required: true,
                    attributes: [] // Remove profile details
                },
            ],
        })

        if (!contract) return res.status(404).end()

        res.json(contract)
    }

    async findById(req, res) {
        const {Contract, Profile} = req.app.get('models')
        const {id} = req.params
        const contract = await Contract.findOne({
            where: {id},
            include: [
                {
                    model: Profile,
                    as: 'Client',
                    where: {
                        id: req.profile.id
                    },
                    required: true,
                    attributes: [] // Remove profile details
                },
            ],
        })
        if (!contract) return res.status(404).end()
        res.json(contract)
    };
}

module.exports = new ContractController()