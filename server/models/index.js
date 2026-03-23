const { Sequelize } = require('sequelize')
const config = require('../config')

/** 数据库连接实例 */
const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,
    logging: false
  }
)

// 导入模型
const User = require('./User')(sequelize)
const Series = require('./Series')(sequelize)
const Collection = require('./Collection')(sequelize)
const Order = require('./Order')(sequelize)
const Creator = require('./Creator')(sequelize)

// 定义关联关系
Creator.belongsTo(User, { foreignKey: 'userId' })
Series.belongsTo(Creator, { foreignKey: 'creatorId' })
Collection.belongsTo(Series, { foreignKey: 'seriesId' })
Collection.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' })
Order.belongsTo(User, { foreignKey: 'userId' })
Order.belongsTo(Collection, { foreignKey: 'collectionId' })

module.exports = {
  sequelize,
  User,
  Series,
  Collection,
  Order,
  Creator
}
