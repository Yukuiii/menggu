const { Follow, Creator, User } = require('../models')
const { success, fail } = require('../utils/response')

/** 关注创作者 */
exports.follow = async (req, res, next) => {
  try {
    const { creatorId } = req.body
    if (!creatorId) return fail(res, '请指定创作者')

    const creator = await Creator.findByPk(creatorId)
    if (!creator || creator.status !== 1) return fail(res, '创作者不存在')
    if (creator.userId === req.userId) return fail(res, '不能关注自己')

    // 检查是否已关注
    const existing = await Follow.findOne({ where: { userId: req.userId, creatorId } })
    if (existing) return fail(res, '您已关注该创作者')

    await Follow.create({ userId: req.userId, creatorId })
    await creator.increment('fansCount')

    success(res, null, '关注成功')
  } catch (err) { next(err) }
}

/** 取消关注 */
exports.unfollow = async (req, res, next) => {
  try {
    const { creatorId } = req.body
    const result = await Follow.destroy({ where: { userId: req.userId, creatorId } })
    if (result === 0) return fail(res, '未找到关注记录')

    const creator = await Creator.findByPk(creatorId)
    if (creator && creator.fansCount > 0) {
      await creator.decrement('fansCount')
    }

    success(res, null, '已取消关注')
  } catch (err) { next(err) }
}

/** 我的关注列表 */
exports.list = async (req, res, next) => {
  try {
    const follows = await Follow.findAll({
      where: { userId: req.userId },
      include: [{
        model: Creator,
        attributes: ['id', 'name', 'avatar', 'intro', 'worksCount', 'fansCount'],
        include: [{ model: User, attributes: ['id', 'nickname'] }]
      }],
      order: [['createdAt', 'DESC']]
    })
    success(res, follows)
  } catch (err) { next(err) }
}

/** 检查是否已关注某创作者 */
exports.check = async (req, res, next) => {
  try {
    const follow = await Follow.findOne({
      where: { userId: req.userId, creatorId: req.params.creatorId }
    })
    success(res, { followed: !!follow })
  } catch (err) { next(err) }
}
