const router = require('express').Router()
const uploadController = require('../controllers/uploadController')
const { uploadCover, uploadFile } = require('../middlewares/upload')
const auth = require('../middlewares/auth')

router.post('/cover', auth, uploadCover.single('file'), uploadController.uploadCover)
router.post('/file', auth, uploadFile.single('file'), uploadController.uploadFile)

module.exports = router
