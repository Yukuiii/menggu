-- ============================================
-- 蒙古服饰非遗数字藏品平台 - 数据库初始化脚本
-- ============================================

DROP DATABASE IF EXISTS `menggu`;
CREATE DATABASE `menggu` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `menggu`;

-- ----------------------------
-- 用户表
-- ----------------------------
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱（登录账号）',
  `password` VARCHAR(100) NOT NULL COMMENT '密码（bcrypt加密）',
  `phone` VARCHAR(11) DEFAULT NULL COMMENT '手机号',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `bio` VARCHAR(200) DEFAULT NULL COMMENT '个人简介',
  `wallet_address` VARCHAR(42) NOT NULL COMMENT '数字钱包地址',
  `balance` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '钱包余额',
  `real_name` VARCHAR(50) DEFAULT NULL COMMENT '真实姓名（加密存储）',
  `id_card` VARCHAR(18) DEFAULT NULL COMMENT '身份证号（加密存储）',
  `is_verified` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否实名认证 0否 1是',
  `role` VARCHAR(10) NOT NULL DEFAULT 'user' COMMENT '角色 user普通用户 admin管理员',
  `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态 0封禁 1正常',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_phone` (`phone`),
  UNIQUE KEY `uk_wallet` (`wallet_address`)
) ENGINE=InnoDB COMMENT='用户表';

-- ----------------------------
-- 创作者表
-- ----------------------------
CREATE TABLE `creators` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '创作者ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '关联用户ID',
  `name` VARCHAR(50) NOT NULL COMMENT '创作者名称/工作室名',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '创作者头像',
  `intro` TEXT DEFAULT NULL COMMENT '简介',
  `portfolio` TEXT DEFAULT NULL COMMENT '作品集链接',
  `contact` VARCHAR(100) DEFAULT NULL COMMENT '联系方式',
  `fans_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '粉丝数',
  `works_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '已发布作品数',
  `total_sales` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '总销量（件数）',
  `total_revenue` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '累计收益（元）',
  `available_revenue` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '可提现收益（元）',
  `withdrawn_revenue` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '已提现收益（元）',
  `commission_rate` DECIMAL(4,2) NOT NULL DEFAULT 90.00 COMMENT '分成比例（%），默认创作者90%',
  `is_certified` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否认证创作者 0否 1是',
  `certified_type` VARCHAR(20) DEFAULT NULL COMMENT '认证类型：individual个人/studio工作室/institution机构',
  `status` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '状态 0待审核 1已通过 2已拒绝',
  `reject_reason` VARCHAR(200) DEFAULT NULL COMMENT '拒绝原因',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`)
) ENGINE=InnoDB COMMENT='创作者表';

-- ----------------------------
-- 创作者收益明细表
-- ----------------------------
CREATE TABLE `creator_revenues` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `creator_id` INT UNSIGNED NOT NULL COMMENT '创作者ID',
  `order_id` INT UNSIGNED NOT NULL COMMENT '关联订单ID',
  `collection_id` INT UNSIGNED NOT NULL COMMENT '关联藏品ID',
  `order_amount` DECIMAL(10,2) NOT NULL COMMENT '订单金额',
  `commission_rate` DECIMAL(4,2) NOT NULL COMMENT '分成比例（%）',
  `revenue_amount` DECIMAL(10,2) NOT NULL COMMENT '创作者实际收益',
  `platform_amount` DECIMAL(10,2) NOT NULL COMMENT '平台抽成',
  `status` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '状态 0待结算 1已结算 2已提现',
  `settled_at` DATETIME DEFAULT NULL COMMENT '结算时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB COMMENT='创作者收益明细表';


-- ----------------------------
-- 藏品表
-- ----------------------------
CREATE TABLE `collections` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '藏品ID',
  `name` VARCHAR(30) NOT NULL COMMENT '藏品名称',
  `cover` VARCHAR(255) NOT NULL COMMENT '封面图',
  `file_url` VARCHAR(255) DEFAULT NULL COMMENT '藏品原始文件URL',
  `file_type` ENUM('image','audio','video','3d') NOT NULL DEFAULT 'image' COMMENT '文件类型',
  `category` VARCHAR(20) DEFAULT NULL COMMENT '藏品分类（服饰图鉴/纹样艺术/工艺实拍/3D模型等）',
  `creator_id` INT UNSIGNED NOT NULL COMMENT '所属创作者ID',
  `total_supply` INT UNSIGNED NOT NULL COMMENT '发行总量',
  `current_no` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '当前已售编号',
  `price` DECIMAL(10,2) NOT NULL COMMENT '单价（元）',

  `limit_per_user` INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '每人限购数量',
  `description` TEXT DEFAULT NULL COMMENT '藏品描述（富文本）',
  `chain_hash` VARCHAR(66) DEFAULT NULL COMMENT '链上哈希',
  `contract_address` VARCHAR(42) DEFAULT NULL COMMENT '模拟合约地址（每个藏品一个）',
  `block_height` BIGINT UNSIGNED DEFAULT NULL COMMENT '区块高度',
  `chain_time` DATETIME DEFAULT NULL COMMENT '上链时间',
  `status` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '状态 0草稿 1审核中 2已通过 3已拒绝 5发售中 6已售罄 7已下架',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB COMMENT='藏品表';

-- ----------------------------
-- 用户藏品持有表（用户购买/获赠的具体藏品实例）
-- ----------------------------
CREATE TABLE `user_collections` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '持有者ID',
  `collection_id` INT UNSIGNED NOT NULL COMMENT '藏品ID',
  `token_id` INT UNSIGNED NOT NULL COMMENT '藏品编号（如 #0001）',
  `chain_hash` VARCHAR(66) DEFAULT NULL COMMENT '该实例的链上哈希',
  `acquire_type` ENUM('purchase','gift','airdrop') NOT NULL DEFAULT 'purchase' COMMENT '获取方式',
  `acquire_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '获取时间',
  `is_transferable` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否可转赠（冷却期后可转）',
  `transfer_cooldown_at` DATETIME DEFAULT NULL COMMENT '可转赠时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_collection_id` (`collection_id`)
) ENGINE=InnoDB COMMENT='用户藏品持有表';

-- ----------------------------
-- 订单表
-- ----------------------------
CREATE TABLE `orders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` VARCHAR(32) NOT NULL COMMENT '订单编号',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `collection_id` INT UNSIGNED NOT NULL COMMENT '藏品ID',
  `token_id` INT UNSIGNED DEFAULT NULL COMMENT '藏品编号',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '支付金额',
  `status` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '状态 0待支付 1已支付 2已完成 3已取消 4已退款',
  `paid_at` DATETIME DEFAULT NULL COMMENT '支付时间',
  `expire_at` DATETIME NOT NULL COMMENT '订单过期时间（15分钟）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB COMMENT='订单表';

-- ----------------------------
-- 流转记录表（记录藏品所有权变更历史）
-- ----------------------------
CREATE TABLE `transfer_records` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_collection_id` INT UNSIGNED NOT NULL COMMENT '用户藏品ID',
  `collection_id` INT UNSIGNED NOT NULL COMMENT '藏品ID',
  `token_id` INT UNSIGNED NOT NULL COMMENT '藏品编号',
  `from_user_id` INT UNSIGNED DEFAULT NULL COMMENT '转出方用户ID（铸造时为NULL）',
  `to_user_id` INT UNSIGNED NOT NULL COMMENT '转入方用户ID',
  `type` ENUM('mint','purchase','gift') NOT NULL COMMENT '类型：铸造/购买/转赠',
  `chain_hash` VARCHAR(66) DEFAULT NULL COMMENT '链上哈希',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_collection_token` (`collection_id`, `token_id`)
) ENGINE=InnoDB COMMENT='流转记录表';

-- ----------------------------
-- 充值记录表
-- ----------------------------
CREATE TABLE `recharge_records` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `amount` DECIMAL(12,2) NOT NULL COMMENT '充值金额',
  `balance_after` DECIMAL(12,2) NOT NULL COMMENT '充值后余额',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB COMMENT='充值记录表';

-- ----------------------------
-- 消息通知表
-- ----------------------------
CREATE TABLE `notifications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '接收用户ID',
  `title` VARCHAR(100) NOT NULL COMMENT '消息标题',
  `content` TEXT NOT NULL COMMENT '消息内容',
  `type` ENUM('purchase','gift','sale','audit','system') NOT NULL COMMENT '消息类型',
  `is_read` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已读',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_read` (`user_id`, `is_read`)
) ENGINE=InnoDB COMMENT='消息通知表';

-- ----------------------------
-- Banner轮播图表
-- ----------------------------
CREATE TABLE `banners` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Banner ID',
  `title` VARCHAR(100) DEFAULT NULL COMMENT '标题',
  `image_url` VARCHAR(255) NOT NULL COMMENT '图片URL',
  `link_url` VARCHAR(255) DEFAULT NULL COMMENT '跳转链接',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序（数值越小越靠前）',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT='Banner轮播图表';

-- ----------------------------
-- 系统公告表
-- ----------------------------
CREATE TABLE `announcements` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `title` VARCHAR(100) NOT NULL COMMENT '公告标题',
  `content` TEXT NOT NULL COMMENT '公告内容',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT='系统公告表';



-- ----------------------------
-- 关注关系表
-- ----------------------------
CREATE TABLE `follows` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '关注ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '关注者用户ID',
  `creator_id` INT UNSIGNED NOT NULL COMMENT '被关注创作者ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_creator` (`user_id`, `creator_id`),
  KEY `idx_creator_id` (`creator_id`)
) ENGINE=InnoDB COMMENT='关注关系表';

-- ----------------------------
-- 初始化管理员账号（密码: 123456）
-- ----------------------------
INSERT INTO `users` (`email`, `password`, `nickname`, `wallet_address`, `balance`, `is_verified`, `role`, `status`)
VALUES ('admin@qq.com', '$2b$10$AbZGZhCbkw9tuwlFwU.YNeIJFCYH2AphWe41oGtLFvLgaWghyaMHi', '管理员', '0xADMIN0000000000000000000000000000000000', 0.00, 1, 'admin', 1);

-- ----------------------------
-- 初始化普通用户（密码: 123456）
-- ----------------------------
INSERT INTO `users` (`email`, `password`, `nickname`, `wallet_address`, `balance`, `is_verified`, `role`, `status`)
VALUES ('user@qq.com', '$2b$10$AbZGZhCbkw9tuwlFwU.YNeIJFCYH2AphWe41oGtLFvLgaWghyaMHi', '测试用户', '0xUSER00000000000000000000000000000000001', 10000.00, 1, 'user', 1);
