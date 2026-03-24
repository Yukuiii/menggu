const { DataTypes } = require('sequelize')

/** 藏品预约模型（用户预约即将发售的藏品） */
module.exports = (sequelize) => {
  return sequelize.define('Subscription', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, comment: '用户ID' },
    collectionId: { type: DataTypes.INTEGER, comment: '藏品ID' },
    notified: { type: DataTypes.BOOLEAN, defaultValue: false, comment: '是否已发送提醒' }
  }, { tableName: 'subscriptions', timestamps: true, updatedAt: false })
}
