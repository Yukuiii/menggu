const { DataTypes } = require('sequelize')

/** 轮播图模型 */
module.exports = (sequelize) => {
  return sequelize.define('Banner', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(100), comment: '标题' },
    imageUrl: { type: DataTypes.STRING(255), comment: '图片URL' },
    linkUrl: { type: DataTypes.STRING(255), comment: '跳转链接' },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0, comment: '排序（越小越靠前）' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, comment: '是否启用' }
  }, { tableName: 'banners', timestamps: true })
}
