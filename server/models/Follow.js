const { DataTypes } = require('sequelize')

/** 关注关系模型 */
module.exports = (sequelize) => {
  return sequelize.define('Follow', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, comment: '关注者用户ID' },
    creatorId: { type: DataTypes.INTEGER, comment: '被关注创作者ID' }
  }, { tableName: 'follows', timestamps: true, updatedAt: false })
}
