const router = require('express').Router()
const creatorController = require('../controllers/creatorController')
const auth = require('../middlewares/auth')

router.post('/apply', auth, creatorController.apply)
router.get('/profile', auth, creatorController.profile)
router.get('/stats', auth, creatorController.stats)
router.get('/works', auth, creatorController.works)
router.post('/publish', auth, creatorController.publish)

module.exports = router
