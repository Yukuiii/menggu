const router = require('express').Router()
const subscriptionController = require('../controllers/subscriptionController')
const auth = require('../middlewares/auth')

router.post('/subscribe', auth, subscriptionController.subscribe)
router.post('/unsubscribe', auth, subscriptionController.unsubscribe)
router.get('/', auth, subscriptionController.list)
router.get('/check/:collectionId', auth, subscriptionController.check)

module.exports = router
