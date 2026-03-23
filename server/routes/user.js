const router = require('express').Router()
const userController = require('../controllers/userController')
const auth = require('../middlewares/auth')

/** 注册 */
router.post('/register', userController.register)
/** 登录 */
router.post('/login', userController.login)
/** 获取当前用户信息（需登录） */
router.get('/profile', auth, userController.getProfile)
/** 实名认证（需登录） */
router.post('/verify', auth, userController.verify)

module.exports = router
