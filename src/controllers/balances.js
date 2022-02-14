const { Op } = require("sequelize");
const { sequelize } = require("../model");
const BaseController = require("./base");

const ALLOWED_RATE = 0.25;

class BalancesController extends BaseController {

  /**
   * It creates a deposit for the user.
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  createDeposit = async (req, res) => {
    const { Job, Contract, Profile } = req.app.get("models");
    const profile = await Profile.findByPk(req.params.userId);

    if (!profile) {
      return this.notFound(res, "Client not found");
    }

    if (profile.type !== "client") {
      return this.notAuthorized(
        res,
        `You don't have the rights to execute this operation.`
      );
    }

    const clientJobsWhere = {
      paid: {
        [Op.or]: [null, 0, false],
      },
    };

    const clientJobsIncludes = [
      {
        model: Contract,
        where: {
          status: {
            [Op.in]: ["new", "in_progress"],
          },
          ClientId: profile.id,
        },
        required: true,
        attributes: [],
      },
    ];

    // Fetch all jobs that are pending payment.
    const clientJobs = await Job.findAll({
      where: clientJobsWhere,
      include: clientJobsIncludes,
    });

    // Sum all jobs price.
    const amountJobsToPay = clientJobs
      .map((job) => job.price)
      .reduce((prev, current) => prev + current, 0);

    const allowedDepositRate = amountJobsToPay * ALLOWED_RATE;

    // The credit has to be lower than the allowed rate.
    if (req.body.credit > allowedDepositRate) {
      return this.applicationError(
        res,
        `You cannot deposit more than 25% of your current pending jobs. You're allowed to deposit ${allowedDepositRate}.`
      );
    }

    profile.balance += req.body.credit;
    await profile.save();

    return res.json({
      message: "The deposit has been created successfully",
    });
  };
}

module.exports = new BalancesController();
