const router = require('express').Router()
const walletController = require('../controllers/walletController')
const auth = require('../middlewares/auth')

router.get('/balance', auth, walletController.balance)
router.post('/recharge', auth, walletController.recharge)

module.exports = router
