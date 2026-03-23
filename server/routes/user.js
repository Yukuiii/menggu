const router = require('express').Router()
const userController = require('../controllers/userController')
const auth = require('../middlewares/auth')

router.post('/login', userController.login)
router.get('/profile', auth, userController.getProfile)
router.post('/verify', auth, userController.verify)

module.exports = router
