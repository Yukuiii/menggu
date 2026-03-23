const { DataTypes } = require('sequelize')

/** 创作者模型 */
module.exports = (sequelize) => {
  return sequelize.define('Creator', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, comment: '关联用户ID' },
    name: { type: DataTypes.STRING(50), comment: '创作者名称' },
    intro: { type: DataTypes.TEXT, comment: '简介' },
    portfolio: { type: DataTypes.TEXT, comment: '作品集链接' },
    contact: { type: DataTypes.STRING(100), comment: '联系方式' },
    status: { type: DataTypes.TINYINT, defaultValue: 0, comment: '状态 0待审核 1已通过 2已拒绝' }
  }, { tableName: 'creators', timestamps: true })
}
