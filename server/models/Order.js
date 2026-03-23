const { DataTypes } = require('sequelize')

/** 订单模型 */
module.exports = (sequelize) => {
  return sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderNo: { type: DataTypes.STRING(32), unique: true, comment: '订单编号' },
    userId: { type: DataTypes.INTEGER, comment: '用户ID' },
    collectionId: { type: DataTypes.INTEGER, comment: '藏品ID' },
    amount: { type: DataTypes.DECIMAL(10, 2), comment: '支付金额' },
    payMethod: { type: DataTypes.STRING(20), comment: '支付方式' },
    status: { type: DataTypes.TINYINT, defaultValue: 0, comment: '状态 0待支付 1已支付 2已完成 3已取消 4已退款' },
    paidAt: { type: DataTypes.DATE, comment: '支付时间' }
  }, { tableName: 'orders', timestamps: true })
}
