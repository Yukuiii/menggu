const { DataTypes } = require('sequelize')

/** 流转记录模型 */
module.exports = (sequelize) => {
  return sequelize.define('TransferRecord', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userCollectionId: { type: DataTypes.INTEGER, comment: '用户藏品ID' },
    collectionId: { type: DataTypes.INTEGER, comment: '藏品ID' },
    tokenId: { type: DataTypes.INTEGER, comment: '藏品编号' },
    fromUserId: { type: DataTypes.INTEGER, allowNull: true, comment: '转出方用户ID（铸造时为NULL）' },
    toUserId: { type: DataTypes.INTEGER, comment: '转入方用户ID' },
    type: { type: DataTypes.ENUM('mint', 'purchase', 'gift'), comment: '类型 mint铸造 purchase购买 gift转赠' },
    chainHash: { type: DataTypes.STRING(66), comment: '链上哈希' }
  }, { tableName: 'transfer_records', timestamps: true, updatedAt: false })
}
