const router = require('express').Router()
const adminController = require('../controllers/adminController')
const auth = require('../middlewares/auth')

// 数据看板
router.get('/dashboard', auth, adminController.dashboard)

// 用户管理
router.get('/users', auth, adminController.userList)
router.get('/users/:id', auth, adminController.userDetail)
router.post('/users/:id/toggle-status', auth, adminController.toggleUserStatus)

// 藏品管理
router.get('/collections', auth, adminController.collectionList)
router.post('/collections/:id/audit', auth, adminController.auditCollection)
router.post('/collections/:id/toggle-status', auth, adminController.toggleCollectionStatus)

// 系列管理
router.get('/series', auth, adminController.seriesList)

// 订单管理
router.get('/orders', auth, adminController.orderList)
router.post('/orders/:id/refund', auth, adminController.refundOrder)

// 创作者管理
router.get('/creators', auth, adminController.creatorList)
router.post('/creators/:id/audit', auth, adminController.auditCreator)

// 公告管理
router.get('/announcements', auth, adminController.announcementList)
router.post('/announcements', auth, adminController.createAnnouncement)
router.put('/announcements/:id', auth, adminController.updateAnnouncement)
router.delete('/announcements/:id', auth, adminController.deleteAnnouncement)

// 系统设置
router.get('/settings', auth, adminController.getSettings)
router.put('/settings', auth, adminController.updateSettings)

module.exports = router
