const router = require('express').Router()
const collectionController = require('../controllers/collectionController')
const auth = require('../middlewares/auth')

router.get('/', collectionController.list)
router.get('/:id', collectionController.detail)
router.post('/', auth, collectionController.create)

module.exports = router
