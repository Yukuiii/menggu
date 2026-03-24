const router = require('express').Router()
const followController = require('../controllers/followController')
const auth = require('../middlewares/auth')

router.post('/follow', auth, followController.follow)
router.post('/unfollow', auth, followController.unfollow)
router.get('/', auth, followController.list)
router.get('/check/:creatorId', auth, followController.check)

module.exports = router
