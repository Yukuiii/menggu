const { DataTypes } = require('sequelize')

/** 用户模型 */
module.exports = (sequelize) => {
  return sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    phone: { type: DataTypes.STRING(11), unique: true, comment: '手机号' },
    nickname: { type: DataTypes.STRING(50), comment: '昵称' },
    avatar: { type: DataTypes.STRING(255), comment: '头像URL' },
    walletAddress: { type: DataTypes.STRING(42), unique: true, comment: '数字钱包地址' },
    realName: { type: DataTypes.STRING(50), comment: '真实姓名' },
    idCard: { type: DataTypes.STRING(18), comment: '身份证号' },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false, comment: '是否实名认证' },
    status: { type: DataTypes.TINYINT, defaultValue: 1, comment: '状态 1正常 0封禁' }
  }, { tableName: 'users', timestamps: true })
}
