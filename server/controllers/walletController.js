const { User, RechargeRecord, sequelize } = require('../models')
const { success, fail } = require('../utils/response')

/** 查询钱包余额 */
exports.balance = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['walletAddress', 'balance']
    })
    if (!user) return fail(res, '用户不存在', 1, 404)
    success(res, { address: user.walletAddress, balance: user.balance })
  } catch (err) { next(err) }
}

/** 模拟充值（事务内更新余额+创建记录） */
exports.recharge = async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    const { amount } = req.body
    const rechargeAmount = parseFloat(amount)
    if (!rechargeAmount || rechargeAmount <= 0) {
      await t.rollback()
      return fail(res, '充值金额必须大于0')
    }

    // 加锁更新余额
    const user = await User.findByPk(req.userId, { lock: true, transaction: t })
    user.balance = parseFloat(user.balance) + rechargeAmount
    await user.save({ transaction: t })

    // 创建充值记录
    await RechargeRecord.create({
      userId: req.userId,
      amount: rechargeAmount,
      balanceAfter: user.balance
    }, { transaction: t })

    await t.commit()
    success(res, { balance: user.balance }, '充值成功')
  } catch (err) {
    await t.rollback()
    next(err)
  }
}
