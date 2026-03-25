const router = require('express').Router()
const notificationController = require('../controllers/notificationController')
const auth = require('../middlewares/auth')

router.get('/', auth, notificationController.list)
router.get('/unread-count', auth, notificationController.unreadCount)
router.post('/read-all', auth, notificationController.markAllRead)
router.post('/:id/read', auth, notificationController.markRead)

module.exports = router
