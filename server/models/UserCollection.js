const { DataTypes } = require('sequelize')

/** 用户藏品持有模型 */
module.exports = (sequelize) => {
  return sequelize.define('UserCollection', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, comment: '持有者ID' },
    collectionId: { type: DataTypes.INTEGER, comment: '藏品ID' },
    tokenId: { type: DataTypes.INTEGER, comment: '藏品编号' },
    chainHash: { type: DataTypes.STRING(66), comment: '该实例的链上哈希' },
    acquireType: { type: DataTypes.ENUM('purchase', 'gift', 'airdrop'), defaultValue: 'purchase', comment: '获取方式' },
    acquireTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, comment: '获取时间' },
    isTransferable: { type: DataTypes.BOOLEAN, defaultValue: false, comment: '是否可转赠' },
    transferCooldownAt: { type: DataTypes.DATE, comment: '可转赠时间' }
  }, { tableName: 'user_collections', timestamps: true, updatedAt: false })
}
