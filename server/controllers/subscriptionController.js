const { Subscription, Collection, Notification, Series, Creator } = require('../models')
const { success, fail } = require('../utils/response')

/** 预约藏品发售提醒 */
exports.subscribe = async (req, res, next) => {
  try {
    const { collectionId } = req.body
    if (!collectionId) return fail(res, '请指定藏品')

    const collection = await Collection.findByPk(collectionId)
    if (!collection) return fail(res, '藏品不存在')
    if (collection.status !== 4) return fail(res, '该藏品不在待发售状态，无需预约')

    // 检查是否已预约
    const existing = await Subscription.findOne({
      where: { userId: req.userId, collectionId }
    })
    if (existing) return fail(res, '您已预约该藏品')

    await Subscription.create({ userId: req.userId, collectionId })
    success(res, null, '预约成功，发售时将通知您')
  } catch (err) { next(err) }
}

/** 取消预约 */
exports.unsubscribe = async (req, res, next) => {
  try {
    const { collectionId } = req.body
    const result = await Subscription.destroy({
      where: { userId: req.userId, collectionId }
    })
    if (result === 0) return fail(res, '未找到预约记录')
    success(res, null, '已取消预约')
  } catch (err) { next(err) }
}

/** 查询我的预约列表 */
exports.list = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.findAll({
      where: { userId: req.userId },
      include: [{
        model: Collection,
        attributes: ['id', 'name', 'cover', 'price', 'saleTime', 'status'],
        include: [{
          model: Series,
          attributes: ['id', 'name'],
          include: [{ model: Creator, attributes: ['id', 'name'] }]
        }]
      }],
      order: [['createdAt', 'DESC']]
    })
    success(res, subscriptions)
  } catch (err) { next(err) }
}

/** 检查是否已预约某藏品 */
exports.check = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({
      where: { userId: req.userId, collectionId: req.params.collectionId }
    })
    success(res, { subscribed: !!sub })
  } catch (err) { next(err) }
}

/** 触发发售提醒（藏品状态变为发售中时调用） */
exports.notifySubscribers = async (collectionId, collectionName) => {
  try {
    const subs = await Subscription.findAll({
      where: { collectionId, notified: false }
    })
    if (subs.length === 0) return

    // 批量创建通知
    const notifications = subs.map(sub => ({
      userId: sub.userId,
      title: '发售提醒',
      content: `您预约的藏品「${collectionName}」已开始发售，快去抢购吧！`,
      type: 'system'
    }))
    await Notification.bulkCreate(notifications)

    // 标记已通知
    await Subscription.update(
      { notified: true },
      { where: { collectionId, notified: false } }
    )
  } catch (err) {
    console.error('发售提醒通知失败:', err.message)
  }
}
