const { DataTypes } = require('sequelize')

/** 充值记录模型 */
module.exports = (sequelize) => {
  return sequelize.define('RechargeRecord', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, comment: '用户ID' },
    amount: { type: DataTypes.DECIMAL(12, 2), comment: '充值金额' },
    balanceAfter: { type: DataTypes.DECIMAL(12, 2), comment: '充值后余额' }
  }, { tableName: 'recharge_records', timestamps: true, updatedAt: false })
}
