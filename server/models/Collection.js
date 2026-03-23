const { DataTypes } = require('sequelize')

/** 数字藏品模型 */
module.exports = (sequelize) => {
  return sequelize.define('Collection', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(30), comment: '藏品名称' },
    cover: { type: DataTypes.STRING(255), comment: '封面图' },
    file: { type: DataTypes.STRING(255), comment: '藏品原始文件' },
    seriesId: { type: DataTypes.INTEGER, comment: '所属系列ID' },
    totalSupply: { type: DataTypes.INTEGER, comment: '发行总量' },
    currentNo: { type: DataTypes.INTEGER, defaultValue: 0, comment: '当前已售编号' },
    price: { type: DataTypes.DECIMAL(10, 2), comment: '单价(元)' },
    saleTime: { type: DataTypes.DATE, comment: '发售时间' },
    description: { type: DataTypes.TEXT, comment: '藏品描述' },
    chainHash: { type: DataTypes.STRING(66), comment: '链上哈希' },
    contractAddress: { type: DataTypes.STRING(42), comment: '合约地址' },
    blockHeight: { type: DataTypes.BIGINT, comment: '区块高度' },
    chainTime: { type: DataTypes.DATE, comment: '上链时间' },
    status: { type: DataTypes.TINYINT, defaultValue: 0, comment: '状态 0草稿 1审核中 2已通过 3已拒绝 4发售中 5已售罄 6已下架' },
    ownerId: { type: DataTypes.INTEGER, comment: '当前持有者ID' }
  }, { tableName: 'collections', timestamps: true })
}
