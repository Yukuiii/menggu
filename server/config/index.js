require("dotenv").config();

module.exports = {
  // 数据库配置
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || "menggu",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    dialect: "mysql",
  },
  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET || "menggu-secret-key",
    expiresIn: "7d",
  },
  // 服务端口
  port: process.env.PORT || 3001,
};
