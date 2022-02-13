const {Router} = require('express');
const {getProfile} = require("../middleware/getProfile");
const router = Router()
const JobsController = require('../controllers/jobs');

router.get('/jobs/unpaid', getProfile, JobsController.findUnpaidJobs)
router.post('/jobs/:job_id/pay', getProfile, JobsController.payJob)


module.exports = router;