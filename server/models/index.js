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
    logging: false,
    define: { underscored: true }
  }
)

// 导入模型
const User = require('./User')(sequelize)
const Series = require('./Series')(sequelize)
const Collection = require('./Collection')(sequelize)
const Order = require('./Order')(sequelize)
const Creator = require('./Creator')(sequelize)
const UserCollection = require('./UserCollection')(sequelize)
const TransferRecord = require('./TransferRecord')(sequelize)
const RechargeRecord = require('./RechargeRecord')(sequelize)
const Notification = require('./Notification')(sequelize)
const Banner = require('./Banner')(sequelize)
const Announcement = require('./Announcement')(sequelize)
const CreatorRevenue = require('./CreatorRevenue')(sequelize)

const Follow = require('./Follow')(sequelize)

// ========== 定义关联关系 ==========

// User <-> Creator 一对一
Creator.belongsTo(User, { foreignKey: 'userId' })
User.hasOne(Creator, { foreignKey: 'userId' })

// Creator <-> Series 一对多
Series.belongsTo(Creator, { foreignKey: 'creatorId' })
Creator.hasMany(Series, { foreignKey: 'creatorId' })

// Series <-> Collection 一对多
Collection.belongsTo(Series, { foreignKey: 'seriesId' })
Series.hasMany(Collection, { foreignKey: 'seriesId' })

// User <-> Order 一对多
Order.belongsTo(User, { foreignKey: 'userId' })
User.hasMany(Order, { foreignKey: 'userId' })

// Collection <-> Order 一对多
Order.belongsTo(Collection, { foreignKey: 'collectionId' })
Collection.hasMany(Order, { foreignKey: 'collectionId' })

// User <-> UserCollection 一对多
UserCollection.belongsTo(User, { foreignKey: 'userId' })
User.hasMany(UserCollection, { foreignKey: 'userId' })

// Collection <-> UserCollection 一对多
UserCollection.belongsTo(Collection, { foreignKey: 'collectionId' })
Collection.hasMany(UserCollection, { foreignKey: 'collectionId' })

// TransferRecord 关联
TransferRecord.belongsTo(Collection, { foreignKey: 'collectionId' })
TransferRecord.belongsTo(UserCollection, { foreignKey: 'userCollectionId' })
TransferRecord.belongsTo(User, { as: 'fromUser', foreignKey: 'fromUserId' })
TransferRecord.belongsTo(User, { as: 'toUser', foreignKey: 'toUserId' })

// RechargeRecord -> User
RechargeRecord.belongsTo(User, { foreignKey: 'userId' })

// Notification -> User
Notification.belongsTo(User, { foreignKey: 'userId' })

// CreatorRevenue 关联
CreatorRevenue.belongsTo(Creator, { foreignKey: 'creatorId' })
CreatorRevenue.belongsTo(Order, { foreignKey: 'orderId' })
CreatorRevenue.belongsTo(Collection, { foreignKey: 'collectionId' })



// Follow 关联
Follow.belongsTo(User, { foreignKey: 'userId' })
Follow.belongsTo(Creator, { foreignKey: 'creatorId' })

module.exports = {
  sequelize,
  User,
  Series,
  Collection,
  Order,
  Creator,
  UserCollection,
  TransferRecord,
  RechargeRecord,
  Notification,
  Banner,
  Announcement,
  CreatorRevenue,
  Follow
}
