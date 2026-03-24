const { DataTypes } = require('sequelize')

/** 消息通知模型 */
module.exports = (sequelize) => {
  return sequelize.define('Notification', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, comment: '接收用户ID' },
    title: { type: DataTypes.STRING(100), comment: '消息标题' },
    content: { type: DataTypes.TEXT, comment: '消息内容' },
    type: { type: DataTypes.ENUM('purchase', 'gift', 'sale', 'audit', 'system'), comment: '消息类型' },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false, comment: '是否已读' }
  }, { tableName: 'notifications', timestamps: true, updatedAt: false })
}
