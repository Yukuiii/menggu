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
    avatar: { type: DataTypes.STRING(255), comment: '创作者头像' },
    fansCount: { type: DataTypes.INTEGER, defaultValue: 0, comment: '粉丝数' },
    worksCount: { type: DataTypes.INTEGER, defaultValue: 0, comment: '已发布作品数' },
    totalSales: { type: DataTypes.INTEGER, defaultValue: 0, comment: '总销量' },
    totalRevenue: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.00, comment: '累计收益' },
    availableRevenue: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.00, comment: '可提现收益' },
    withdrawnRevenue: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.00, comment: '已提现收益' },
    commissionRate: { type: DataTypes.DECIMAL(4, 2), defaultValue: 90.00, comment: '分成比例(%)' },
    isCertified: { type: DataTypes.BOOLEAN, defaultValue: false, comment: '是否认证创作者' },
    certifiedType: { type: DataTypes.STRING(20), comment: '认证类型 individual/studio/institution' },
    status: { type: DataTypes.TINYINT, defaultValue: 0, comment: '状态 0待审核 1已通过 2已拒绝' },
    rejectReason: { type: DataTypes.STRING(200), comment: '拒绝原因' }
  }, { tableName: 'creators', timestamps: true })
}
