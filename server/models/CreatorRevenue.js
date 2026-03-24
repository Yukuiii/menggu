const { DataTypes } = require('sequelize')

/** 创作者收益明细模型 */
module.exports = (sequelize) => {
  return sequelize.define('CreatorRevenue', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    creatorId: { type: DataTypes.INTEGER, comment: '创作者ID' },
    orderId: { type: DataTypes.INTEGER, comment: '关联订单ID' },
    collectionId: { type: DataTypes.INTEGER, comment: '关联藏品ID' },
    orderAmount: { type: DataTypes.DECIMAL(10, 2), comment: '订单金额' },
    commissionRate: { type: DataTypes.DECIMAL(4, 2), comment: '分成比例(%)' },
    revenueAmount: { type: DataTypes.DECIMAL(10, 2), comment: '创作者实际收益' },
    platformAmount: { type: DataTypes.DECIMAL(10, 2), comment: '平台抽成' },
    status: { type: DataTypes.TINYINT, defaultValue: 0, comment: '状态 0待结算 1已结算 2已提现' },
    settledAt: { type: DataTypes.DATE, comment: '结算时间' }
  }, { tableName: 'creator_revenues', timestamps: true, updatedAt: false })
}
