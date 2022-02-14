const {Router} = require('express');
const router = Router()

const ContractsRoutes = require('./contracts');
const JobsRoutes = require('./jobs');
const BalancesRoutes = require('./balances');
const AdminRoutes = require('./admin');

router.use(ContractsRoutes);
router.use(JobsRoutes);
router.use(BalancesRoutes);
router.use(AdminRoutes);


module.exports = router;