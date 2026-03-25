const { Notification } = require('../models')
const { success, fail } = require('../utils/response')

/** 获取当前用户站内信列表 */
exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query
    const where = { userId: req.userId }

    if (isRead === 'true') where.isRead = true
    if (isRead === 'false') where.isRead = false

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const { count, rows } = await Notification.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit)
    })

    success(res, { list: rows, total: count, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) { next(err) }
}

/** 获取当前用户未读站内信数量 */
exports.unreadCount = async (req, res, next) => {
  try {
    const unreadCount = await Notification.count({
      where: { userId: req.userId, isRead: false }
    })

    success(res, { unreadCount })
  } catch (err) { next(err) }
}

/** 将单条站内信标记为已读 */
exports.markRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByPk(req.params.id)
    if (!notification || notification.userId !== req.userId) {
      return fail(res, '站内信不存在')
    }

    if (!notification.isRead) {
      await notification.update({ isRead: true })
    }

    success(res, null, '已标记为已读')
  } catch (err) { next(err) }
}

/** 将当前用户全部未读站内信标记为已读 */
exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.userId, isRead: false } }
    )

    success(res, null, '全部站内信已标记为已读')
  } catch (err) { next(err) }
}
