const {Router} = require('express');
const router = Router()

const ContractsRoutes = require('./contracts');
const JobsRoutes = require('./jobs');
const BalancesRoutes = require('./balances');

router.use(ContractsRoutes);
router.use(JobsRoutes);
router.use(BalancesRoutes);


module.exports = router;