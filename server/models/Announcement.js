const { DataTypes } = require('sequelize')

/** 系统公告模型 */
module.exports = (sequelize) => {
  return sequelize.define('Announcement', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(100), comment: '公告标题' },
    content: { type: DataTypes.TEXT, comment: '公告内容' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, comment: '是否启用' }
  }, { tableName: 'announcements', timestamps: true, updatedAt: false })
}
