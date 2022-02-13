const {Router} = require('express');
const {getProfile} = require("../middleware/getProfile");
const router = Router()

const ContractsRoutes = require('./contracts');

router.use(ContractsRoutes);

module.exports = router;