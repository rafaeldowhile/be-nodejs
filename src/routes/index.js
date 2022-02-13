const {Router} = require('express');
const {getProfile} = require("../middleware/getProfile");
const router = Router()

const ContractsRoutes = require('./contracts');
const JobsRoutes = require('./jobs');

router.use(ContractsRoutes);
router.use(JobsRoutes);


module.exports = router;