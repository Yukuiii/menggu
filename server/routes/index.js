const router = require('express').Router()

/** 注册所有业务路由 */
router.use('/user', require('./user'))
router.use('/collections', require('./collection'))
router.use('/orders', require('./order'))
router.use('/creator', require('./creator'))
router.use('/admin', require('./admin'))
router.use('/my-collections', require('./userCollection'))
router.use('/wallet', require('./wallet'))
router.use('/upload', require('./upload'))
router.use('/follows', require('./follow'))

module.exports = router
