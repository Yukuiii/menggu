const router = require('express').Router()
const adminController = require('../controllers/adminController')
const auth = require('../middlewares/auth')

// TODO: 添加管理员权限中间件
router.get('/dashboard', auth, adminController.dashboard)
router.get('/users', auth, adminController.userList)
router.post('/collections/:id/audit', auth, adminController.auditCollection)
router.post('/creators/:id/audit', auth, adminController.auditCreator)

module.exports = router
