const { DataTypes } = require('sequelize')

/** 藏品系列模型 */
module.exports = (sequelize) => {
  return sequelize.define('Series', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), comment: '系列名称' },
    cover: { type: DataTypes.STRING(255), comment: '封面图' },
    description: { type: DataTypes.TEXT, comment: '系列描述' },
    creatorId: { type: DataTypes.INTEGER, comment: '创作者ID' }
  }, { tableName: 'series', timestamps: true })
}
