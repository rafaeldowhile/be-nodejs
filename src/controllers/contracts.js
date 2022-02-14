const {Op} = require("sequelize");
const BaseController = require("./base");

class ContractController extends BaseController {
    findAll = async (req, res) => {
        const {Contract} = req.app.get('models')

        const contract = await Contract.findAndCountAll({
            where: {
                status: {
                    [Op.in]: ['new', 'in_progress'],
                },
                [Op.or]: {
                    ClientId: req.profile.id,
                    ContractorId: req.profile.id
                }
            },
        })

        if (!contract) return this.notFound("Contracts not found")

        return res.json(contract)
    };

    findById = async (req, res) => {
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

        if (!contract) return this.notFound("Contract not found")

        return res.json(contract)
    };
}

module.exports = new ContractController()