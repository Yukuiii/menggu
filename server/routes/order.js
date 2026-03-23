const router = require('express').Router()
const orderController = require('../controllers/orderController')
const auth = require('../middlewares/auth')

router.post('/', auth, orderController.create)
router.get('/', auth, orderController.list)
router.get('/:id', auth, orderController.detail)

module.exports = router
