const router = require('express').Router()
const userCollectionController = require('../controllers/userCollectionController')
const auth = require('../middlewares/auth')

router.get('/', auth, userCollectionController.list)
router.get('/:id', auth, userCollectionController.detail)
router.post('/:id/transfer', auth, userCollectionController.transfer)
router.get('/:id/download', auth, userCollectionController.download)

module.exports = router
