const {Router} = require('express');
const {getProfile} = require("../middleware/getProfile");
const router = Router()
const BalancesController = require('../controllers/balances');

router.post('/balances/deposit/:userId', getProfile, BalancesController.createDeposit)

module.exports = router;