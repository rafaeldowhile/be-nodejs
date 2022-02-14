const {Router} = require('express');
const router = Router()
const AdminController = require('../controllers/admin');

router.get('/admin/best-profession', AdminController.getBestProfession)
router.get('/admin/best-clients', AdminController.getBestClients)


module.exports = router;