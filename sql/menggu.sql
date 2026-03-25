/*
 Navicat Premium Dump SQL

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 90300 (9.3.0)
 Source Host           : localhost:3306
 Source Schema         : menggu

 Target Server Type    : MySQL
 Target Server Version : 90300 (9.3.0)
 File Encoding         : 65001

 Date: 25/03/2026 10:40:22
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for announcements
-- ----------------------------
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公告标题',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公告内容',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统公告表';

-- ----------------------------
-- Records of announcements
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for banners
-- ----------------------------
DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'Banner ID',
  `title` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标题',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '图片URL',
  `link_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '跳转链接',
  `sort_order` int NOT NULL DEFAULT '0' COMMENT '排序（数值越小越靠前）',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Banner轮播图表';

-- ----------------------------
-- Records of banners
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for collections
-- ----------------------------
DROP TABLE IF EXISTS `collections`;
CREATE TABLE `collections` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '藏品ID',
  `name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '藏品名称',
  `cover` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '封面图',
  `file_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '藏品原始文件URL',
  `file_type` enum('image','audio','video','3d') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'image' COMMENT '文件类型',
  `category` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '藏品分类（服饰图鉴/纹样艺术/工艺实拍/3D模型等）',
  `creator_id` int unsigned NOT NULL COMMENT '所属创作者ID',
  `total_supply` int unsigned NOT NULL COMMENT '发行总量',
  `current_no` int unsigned NOT NULL DEFAULT '0' COMMENT '当前已售编号',
  `price` decimal(10,2) NOT NULL COMMENT '单价（元）',
  `limit_per_user` int unsigned NOT NULL DEFAULT '1' COMMENT '每人限购数量',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT '藏品描述（富文本）',
  `chain_hash` varchar(66) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '链上哈希',
  `contract_address` varchar(42) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '模拟合约地址（每个藏品一个）',
  `block_height` bigint unsigned DEFAULT NULL COMMENT '区块高度',
  `chain_time` datetime DEFAULT NULL COMMENT '上链时间',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态 0草稿 1审核中 2已通过 3已拒绝 5发售中 6已售罄 7已下架',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='藏品表';

-- ----------------------------
-- Records of collections
-- ----------------------------
BEGIN;
INSERT INTO `collections` (`id`, `name`, `cover`, `file_url`, `file_type`, `category`, `creator_id`, `total_supply`, `current_no`, `price`, `limit_per_user`, `description`, `chain_hash`, `contract_address`, `block_height`, `chain_time`, `status`, `created_at`, `updated_at`) VALUES (1, '蒙古长袍', '/uploads/covers/cover_1774338500181_btkbxz.jpeg', '/uploads/files/file_1774338502054_vjbz1a.jpeg', 'image', '服饰图鉴', 1, 100, 3, 99.00, 1, '这是藏品描述', '0xe4baf6a9231003d9020573907aa66f0cab9089f781ac3b058dbd6e3138b9565e', '0xe639b868586b36e5076f0b4488fdf04a49d5ae76', 18000001, '2026-03-24 07:48:49', 5, '2026-03-24 07:48:37', '2026-03-24 08:20:08');
INSERT INTO `collections` (`id`, `name`, `cover`, `file_url`, `file_type`, `category`, `creator_id`, `total_supply`, `current_no`, `price`, `limit_per_user`, `description`, `chain_hash`, `contract_address`, `block_height`, `chain_time`, `status`, `created_at`, `updated_at`) VALUES (2, '蒙古战盔·赤焰鎏金', '/uploads/covers/cover_1774340875855_mgup04.jpeg', '/uploads/files/file_1774340879536_g0752w.jpeg', 'image', '服饰图鉴', 1, 3982, 0, 199.00, 3, '此件战盔以赤色为底，象征着草原勇士的无畏与热血。盔体表面采用精湛的鎏金工艺，錾刻着繁复而华丽的传统纹样与游牧图腾，正中心镶嵌着代表部族荣耀的定制徽记，彰显出佩戴者显赫的贵族身份与威严。头盔两侧及后部垂落着宝蓝色的丝质流苏，在庄严威武的重甲质感中巧妙地融入了一抹灵动之气。\n\n该藏品不仅完美复刻了古代游牧民族高超的金属锻造与手工装饰工艺，更是草原尚武文化、阶级礼仪与图腾信仰的集中艺术体现。', '0xf8da8ad699d46f765043ca6fdc0f54433910cfa3094698e95211f847171c902f', '0x048436e7772bbc384c8c30fd9879a99e28f5de55', 18000005, '2026-03-24 08:29:31', 5, '2026-03-24 08:29:18', '2026-03-24 08:29:31');
INSERT INTO `collections` (`id`, `name`, `cover`, `file_url`, `file_type`, `category`, `creator_id`, `total_supply`, `current_no`, `price`, `limit_per_user`, `description`, `chain_hash`, `contract_address`, `block_height`, `chain_time`, `status`, `created_at`, `updated_at`) VALUES (3, '翠意繁花 · 缂丝镶宝蒙古长袍', '/uploads/covers/cover_1774341350470_n80up5.jpeg', '/uploads/files/file_1774341353173_z5i827.jpeg', 'image', '服饰图鉴', 1, 12345, 0, 299.00, 2, '这件藏品展现了蒙古族服饰文化的博大精深与精湛工艺。长袍通体采用鲜艳的翠绿色缎面，色泽莹润如玉，象征着草原生机勃勃的生命力。\n\n装饰工艺：领口、襟边及袖口处均装饰有极其精细的连珠纹与祥云绣边，尽显华贵。腰间束有一条宽阔的红宝石镶嵌腰带，金质带扣与垂下的金色丝绦相互辉映，体现了穿戴者尊贵的身份地位。\n图案寓意：袍裙下摆处绣有大朵的粉色牡丹与折枝花卉，将中原服饰的吉祥纹样与北方民族的豪迈剪裁有机结合，寓意富贵吉祥、平安如意。\n文化内涵：这件长袍不仅是一件保暖御寒的服饰，更是游牧民族审美与精良手工技艺的结晶。其挺括的立领与宽大的袖口设计，既保留了骑射民族的实用性，又散发出庄重优雅的仪式感。', '0xe721f8c388a57fb78bf8654398f562e4d3ce68657ed5e4e24d4b08439be8c149', '0x09c4902297ae6cc794514ad59c4d9aaff16fa3e7', 18000006, '2026-03-24 08:37:22', 5, '2026-03-24 08:37:14', '2026-03-24 08:37:22');
INSERT INTO `collections` (`id`, `name`, `cover`, `file_url`, `file_type`, `category`, `creator_id`, `total_supply`, `current_no`, `price`, `limit_per_user`, `description`, `chain_hash`, `contract_address`, `block_height`, `chain_time`, `status`, `created_at`, `updated_at`) VALUES (4, '珠玑翠映 · 金工吉祥结冠冕', '/uploads/covers/cover_1774341753788_zkkzsf.jpeg', '/uploads/files/file_1774341757145_ctwig7.jpeg', 'image', '纹样艺术', 1, 10, 0, 999.00, 1, '这件藏品是一顶极具异域风情与古典神韵的头冠，采用纯手工金工技艺打造，展现了古代工匠巧夺天工的艺术造诣。\n\n造型与金工：冠身主体为复古金色，雕刻有极其细腻的云雷纹和宝相花纹样。冠顶呈佛塔状，中心镶嵌一颗巨大的圆形红宝石，周围环绕着珍珠与绿松石。\n\n主要装饰：冠身的正前方和侧面，醒目地嵌有数个由红宝石和绿松石组成的花簇吉祥结造型。冠身底部的绿色缎带上，绣有三个连绵的金色八吉吉祥结（Pan Chang），寓意永恒的吉祥、长寿与智慧。\n\n精美垂饰：头冠两侧各垂下两串长长的垂珠挂饰。挂饰由无数颗细小的绿松石、玛瑙红珠与珍珠串联而成，下端束以流苏。每一串挂饰的底端都连接着一个金色的流苏钟形，流苏钟下端则是用红玛瑙珠串成的穗子，走动时珠翠摇曳，尽显灵动。\n\n整体风格：此冠冕结合了蒙古族头饰的豪迈（如垂挂的珠串）、藏传佛教的宗教符号（八吉祥结）、以及满族点翠艺术的色彩搭配（绿、红、蓝），是一件不可多得的民族文化融合杰作。', '0x7319caf13d62365c7f71fd77168cb5e3dd9cab4e0f8c6bfc7d47e9c2fd95fd5f', '0xac0c0d5ff57f12a99bc334b0a0edb97ac0aa1c28', 18000007, '2026-03-24 08:44:35', 5, '2026-03-24 08:44:28', '2026-03-24 08:44:35');
INSERT INTO `collections` (`id`, `name`, `cover`, `file_url`, `file_type`, `category`, `creator_id`, `total_supply`, `current_no`, `price`, `limit_per_user`, `description`, `chain_hash`, `contract_address`, `block_height`, `chain_time`, `status`, `created_at`, `updated_at`) VALUES (5, '穹庐圣火 · 吉祥酥油供灯仪轨图', '/uploads/covers/cover_1774342208037_i9srcp.jpeg', '/uploads/files/file_1774342210034_oqsszz.jpeg', 'image', '纹样艺术', 1, 23, 1, 1999.00, 1, '这幅作品描绘了蒙古族传统蒙古包（穹庐）内，举行庄严供奉仪式的核心场景。它不仅仅是一张图，更是一次文化体验的定格。\n\n场景环境：画面中心是蒙古包的内部。精美的木质支架（乌尼）和顶圈（陶脑）清晰可见，顶圈敞开，透出蔚蓝的天空和朵朵白云，象征着蒙古族人民对长生天的敬仰。四周的壁毡和地毯上，装饰着传统的吉祥纹样，营造出温馨而神圣的氛围。\n\n核心器物：画面焦点是一个巨大的、极其精美且具有西藏与蒙古融合风格的酥油供灯。\n\n金银錾刻：灯身主体由金银打造，中心有錾刻细腻的八吉吉祥结（Pan Chang）。\n\n宝石镶嵌：灯沿和底座上，密密麻麻地镶嵌着象征尊贵与吉祥的红宝石和绿松石珠。\n\n莲花座圣火：灯顶是由金箔打造的莲花宝座，中心燃着一团熊熊的、纯净的酥油圣火，寓意着智慧、光明和不灭的信仰。\n\n供奉细节：供灯放置在一个精雕细刻的蒙古式长桌（希日格）上。\n\n银碗：供灯左侧放置着一个錾花银碗，内盛清水，象征纯洁的供养。\n\n蓝哈达：供灯右侧，庄重地铺放着一条象征天空、尊贵与好运的蓝色哈达。\n\n文化内涵：这幅场景生动地还原了蒙古族家庭在重大节庆、祈福或日常供奉中的场景。它体现了蒙古族人民将信仰融入日常生活，对神灵、祖先和自然的敬畏，以及对生活美好祝愿的寄托。', '0x2af9ac73b741a49802f0afc5e4db005f0e706cc8cf32e4044a9ccf0d92bba58a', '0x58436dd3fda17fb3fa48947fcce6b7324e8d9da8', 18000009, '2026-03-24 08:58:35', 5, '2026-03-24 08:51:09', '2026-03-25 01:37:32');
INSERT INTO `collections` (`id`, `name`, `cover`, `file_url`, `file_type`, `category`, `creator_id`, `total_supply`, `current_no`, `price`, `limit_per_user`, `description`, `chain_hash`, `contract_address`, `block_height`, `chain_time`, `status`, `created_at`, `updated_at`) VALUES (6, '金鬃翠饰 · 弦音游牧马头琴', '/uploads/covers/cover_1774342559062_6u5y91.jpeg', '/uploads/files/file_1774342561947_f16knj.jpeg', 'image', '工艺实拍', 1, 2500, 0, 328.00, 2, '这件藏品是一把融合了欧亚两种不同音乐传统的艺术乐器，是多元文化和谐共生的象征。它在保留了小提琴（西方古典音乐灵魂）标准形制的同时，创造性地融入了蒙古族传统乐器马头琴（东方草原音乐之魂）的核心视觉符号。\n\n核心融合：马头琴首：最引人注目的革新在于琴头。传统的涡卷形琴头被一个精致的、披着金色鬃毛的马头雕刻取代。马头通体呈现深邃的蓝色（象征天神与长生天），金色的马鬃与镶嵌的宝石交相辉映，栩栩如生。\n\n华美装饰：琴身表面（面板）并未采用传统的清漆，而是被极其考究的民族风珠宝镶嵌所覆盖。在胡桃木色的琴面上，错落有致地镶嵌着无数颗浑圆的绿松石与鲜艳的红玛瑙珠，形成极具草原风情的几何装饰纹样，金质的琴码也装饰着绿松石。\n\n吉祥寓意与细节：马头下方垂挂着两串长长的、由绿松石和珍珠串成的流苏挂饰，底端分别是蓝色哈达和红色哈达造型的穗子，寓意尊贵、好运、永恒和生机。配套的琴弓上也巧妙地镶嵌了绿松石珠。\n\n陈列场景：乐器优雅地放置在一个錾刻细腻的蒙古式木质展架上，背景是温馨的传统蒙古包内壁氈装饰，体现了其根植于草原文化的背景。这件藏品不仅是一件可演奏的乐器，更是一件具有极高文化、历史与艺术收藏价值的艺术品。', '0x2b571cc1f101ef6e74500e2fcfccfd16596f1a03ef99014b5cea30a9f54e7e4c', '0x710ae7f78760552162c747c068203ca19a2df7a5', 18000008, '2026-03-24 08:58:34', 5, '2026-03-24 08:58:26', '2026-03-24 08:58:34');
COMMIT;

-- ----------------------------
-- Table structure for creator_revenues
-- ----------------------------
DROP TABLE IF EXISTS `creator_revenues`;
CREATE TABLE `creator_revenues` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `creator_id` int unsigned NOT NULL COMMENT '创作者ID',
  `order_id` int unsigned NOT NULL COMMENT '关联订单ID',
  `collection_id` int unsigned NOT NULL COMMENT '关联藏品ID',
  `order_amount` decimal(10,2) NOT NULL COMMENT '订单金额',
  `commission_rate` decimal(4,2) NOT NULL COMMENT '分成比例（%）',
  `revenue_amount` decimal(10,2) NOT NULL COMMENT '创作者实际收益',
  `platform_amount` decimal(10,2) NOT NULL COMMENT '平台抽成',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态 0待结算 1已结算 2已提现',
  `settled_at` datetime DEFAULT NULL COMMENT '结算时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='创作者收益明细表';

-- ----------------------------
-- Records of creator_revenues
-- ----------------------------
BEGIN;
INSERT INTO `creator_revenues` (`id`, `creator_id`, `order_id`, `collection_id`, `order_amount`, `commission_rate`, `revenue_amount`, `platform_amount`, `status`, `settled_at`, `created_at`) VALUES (1, 1, 1, 1, 99.00, 90.00, 89.10, 9.90, 0, NULL, '2026-03-24 07:49:31');
INSERT INTO `creator_revenues` (`id`, `creator_id`, `order_id`, `collection_id`, `order_amount`, `commission_rate`, `revenue_amount`, `platform_amount`, `status`, `settled_at`, `created_at`) VALUES (2, 1, 2, 1, 99.00, 90.00, 89.10, 9.90, 0, NULL, '2026-03-24 08:04:01');
INSERT INTO `creator_revenues` (`id`, `creator_id`, `order_id`, `collection_id`, `order_amount`, `commission_rate`, `revenue_amount`, `platform_amount`, `status`, `settled_at`, `created_at`) VALUES (3, 1, 3, 1, 99.00, 90.00, 89.10, 9.90, 0, NULL, '2026-03-24 08:20:08');
INSERT INTO `creator_revenues` (`id`, `creator_id`, `order_id`, `collection_id`, `order_amount`, `commission_rate`, `revenue_amount`, `platform_amount`, `status`, `settled_at`, `created_at`) VALUES (4, 1, 4, 5, 1999.00, 90.00, 1799.10, 199.90, 0, NULL, '2026-03-25 01:37:32');
COMMIT;

-- ----------------------------
-- Table structure for creators
-- ----------------------------
DROP TABLE IF EXISTS `creators`;
CREATE TABLE `creators` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '创作者ID',
  `user_id` int unsigned NOT NULL COMMENT '关联用户ID',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创作者名称/工作室名',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '创作者头像',
  `intro` text COLLATE utf8mb4_unicode_ci COMMENT '简介',
  `portfolio` text COLLATE utf8mb4_unicode_ci COMMENT '作品集链接',
  `contact` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '联系方式',
  `fans_count` int unsigned NOT NULL DEFAULT '0' COMMENT '粉丝数',
  `works_count` int unsigned NOT NULL DEFAULT '0' COMMENT '已发布作品数',
  `total_sales` int unsigned NOT NULL DEFAULT '0' COMMENT '总销量（件数）',
  `total_revenue` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '累计收益（元）',
  `available_revenue` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '可提现收益（元）',
  `withdrawn_revenue` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '已提现收益（元）',
  `commission_rate` decimal(4,2) NOT NULL DEFAULT '90.00' COMMENT '分成比例（%），默认创作者90%',
  `is_certified` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否认证创作者 0否 1是',
  `certified_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '认证类型：individual个人/studio工作室/institution机构',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态 0待审核 1已通过 2已拒绝',
  `reject_reason` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '拒绝原因',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='创作者表';

-- ----------------------------
-- Records of creators
-- ----------------------------
BEGIN;
INSERT INTO `creators` (`id`, `user_id`, `name`, `avatar`, `intro`, `portfolio`, `contact`, `fans_count`, `works_count`, `total_sales`, `total_revenue`, `available_revenue`, `withdrawn_revenue`, `commission_rate`, `is_certified`, `certified_type`, `status`, `reject_reason`, `created_at`, `updated_at`) VALUES (1, 2, 'sakrua工作室', NULL, '我的背景', 'www.baidu.com', 'sakura@qq.com', 0, 6, 4, 2066.40, 2066.40, 0.00, 90.00, 1, 'individual', 1, NULL, '2026-03-24 07:48:04', '2026-03-25 01:37:32');
COMMIT;

-- ----------------------------
-- Table structure for follows
-- ----------------------------
DROP TABLE IF EXISTS `follows`;
CREATE TABLE `follows` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '关注ID',
  `user_id` int unsigned NOT NULL COMMENT '关注者用户ID',
  `creator_id` int unsigned NOT NULL COMMENT '被关注创作者ID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_creator` (`user_id`,`creator_id`),
  KEY `idx_creator_id` (`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='关注关系表';

-- ----------------------------
-- Records of follows
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `user_id` int unsigned NOT NULL COMMENT '接收用户ID',
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '消息标题',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '消息内容',
  `type` enum('purchase','gift','sale','audit','system') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '消息类型',
  `is_read` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否已读',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_read` (`user_id`,`is_read`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消息通知表';

-- ----------------------------
-- Records of notifications
-- ----------------------------
BEGIN;
INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `type`, `is_read`, `created_at`) VALUES (1, 2, '创作者入驻通过', '恭喜！您的创作者入驻申请已通过', 'audit', 1, '2026-03-24 07:48:10');
INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `type`, `is_read`, `created_at`) VALUES (2, 2, '藏品审核通过', '您的藏品「蒙古长袍」已通过审核', 'audit', 1, '2026-03-24 07:48:49');
INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `type`, `is_read`, `created_at`) VALUES (3, 2, '购买成功', '您已成功购买「蒙古长袍」#0001', 'purchase', 1, '2026-03-24 07:49:31');
INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `type`, `is_read`, `created_at`) VALUES (4, 3, '购买成功', '您已成功购买「蒙古长袍」#0002', 'purchase', 0, '2026-03-24 08:04:01');
INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `type`, `is_read`, `created_at`) VALUES (5, 4, '购买成功', '您已成功购买「蒙古长袍」#0003', 'purchase', 0, '2026-03-24 08:20:08');
INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `type`, `is_read`, `created_at`) VALUES (6, 2, '藏品审核通过', '您的藏品「蒙古战盔·赤焰鎏金」已通过审核', 'audit', 1, '2026-03-24 08:29:31');
INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `type`, `is_read`, `created_at`) VALUES (7, 2, '藏品审核通过', '您的藏品「翠意繁花 · 缂丝镶宝蒙古长袍」已通过审核', 'audit', 1, '2026-03-24 08:37:22');
INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `type`, `is_read`, `created_at`) VALUES (8, 2, '藏品审核通过', '您的藏品「珠玑翠映 · 金工吉祥结冠冕」已通过审核', 'audit', 1, '2026-03-24 08:44:35');
INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `type`, `is_read`, `created_at`) VALUES (9, 2, '藏品审核通过', '您的藏品「金鬃翠饰 · 弦音游牧马头琴」已通过审核', 'audit', 1, '2026-03-24 08:58:34');
INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `type`, `is_read`, `created_at`) VALUES (10, 2, '藏品审核通过', '您的藏品「穹庐圣火 · 吉祥酥油供灯仪轨图」已通过审核', 'audit', 1, '2026-03-24 08:58:35');
INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `type`, `is_read`, `created_at`) VALUES (11, 2, '转赠成功', '您已将「蒙古长袍」#0001转赠给钱包 0x8b3605e6af0db31a3540ab47633d026702a7b093', 'gift', 1, '2026-03-24 09:40:40');
INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `type`, `is_read`, `created_at`) VALUES (12, 4, '收到转赠', '您收到了「蒙古长袍」#0001的转赠', 'gift', 0, '2026-03-24 09:40:40');
INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `type`, `is_read`, `created_at`) VALUES (13, 2, '购买成功', '您已成功购买「穹庐圣火 · 吉祥酥油供灯仪轨图」#0001', 'purchase', 1, '2026-03-25 01:37:32');
COMMIT;

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单编号',
  `user_id` int unsigned NOT NULL COMMENT '用户ID',
  `collection_id` int unsigned NOT NULL COMMENT '藏品ID',
  `token_id` int unsigned DEFAULT NULL COMMENT '藏品编号',
  `amount` decimal(10,2) NOT NULL COMMENT '支付金额',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态 0待支付 1已支付 2已完成 3已取消 4已退款',
  `paid_at` datetime DEFAULT NULL COMMENT '支付时间',
  `expire_at` datetime NOT NULL COMMENT '订单过期时间（15分钟）',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- ----------------------------
-- Records of orders
-- ----------------------------
BEGIN;
INSERT INTO `orders` (`id`, `order_no`, `user_id`, `collection_id`, `token_id`, `amount`, `status`, `paid_at`, `expire_at`, `created_at`, `updated_at`) VALUES (1, 'ORD202603241549318359', 2, 1, 1, 99.00, 1, '2026-03-24 07:49:31', '2026-03-24 08:04:31', '2026-03-24 07:49:31', '2026-03-24 07:49:31');
INSERT INTO `orders` (`id`, `order_no`, `user_id`, `collection_id`, `token_id`, `amount`, `status`, `paid_at`, `expire_at`, `created_at`, `updated_at`) VALUES (2, 'ORD202603241604018095', 3, 1, 2, 99.00, 1, '2026-03-24 08:04:01', '2026-03-24 08:19:01', '2026-03-24 08:04:01', '2026-03-24 08:04:01');
INSERT INTO `orders` (`id`, `order_no`, `user_id`, `collection_id`, `token_id`, `amount`, `status`, `paid_at`, `expire_at`, `created_at`, `updated_at`) VALUES (3, 'ORD202603241620077863', 4, 1, 3, 99.00, 1, '2026-03-24 08:20:08', '2026-03-24 08:35:07', '2026-03-24 08:20:07', '2026-03-24 08:20:08');
INSERT INTO `orders` (`id`, `order_no`, `user_id`, `collection_id`, `token_id`, `amount`, `status`, `paid_at`, `expire_at`, `created_at`, `updated_at`) VALUES (4, 'ORD202603250937327132', 2, 5, 1, 1999.00, 1, '2026-03-25 01:37:32', '2026-03-25 01:52:32', '2026-03-25 01:37:32', '2026-03-25 01:37:32');
COMMIT;

-- ----------------------------
-- Table structure for recharge_records
-- ----------------------------
DROP TABLE IF EXISTS `recharge_records`;
CREATE TABLE `recharge_records` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` int unsigned NOT NULL COMMENT '用户ID',
  `amount` decimal(12,2) NOT NULL COMMENT '充值金额',
  `balance_after` decimal(12,2) NOT NULL COMMENT '充值后余额',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='充值记录表';

-- ----------------------------
-- Records of recharge_records
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for transfer_records
-- ----------------------------
DROP TABLE IF EXISTS `transfer_records`;
CREATE TABLE `transfer_records` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_collection_id` int unsigned NOT NULL COMMENT '用户藏品ID',
  `collection_id` int unsigned NOT NULL COMMENT '藏品ID',
  `token_id` int unsigned NOT NULL COMMENT '藏品编号',
  `from_user_id` int unsigned DEFAULT NULL COMMENT '转出方用户ID（铸造时为NULL）',
  `to_user_id` int unsigned NOT NULL COMMENT '转入方用户ID',
  `type` enum('mint','purchase','gift') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '类型：铸造/购买/转赠',
  `chain_hash` varchar(66) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '链上哈希',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_collection_token` (`collection_id`,`token_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='流转记录表';

-- ----------------------------
-- Records of transfer_records
-- ----------------------------
BEGIN;
INSERT INTO `transfer_records` (`id`, `user_collection_id`, `collection_id`, `token_id`, `from_user_id`, `to_user_id`, `type`, `chain_hash`, `created_at`) VALUES (1, 1, 1, 1, NULL, 2, 'purchase', '0x7ce54590e5e5cc3d9d42d10f2bc6c265ec2d36505f21f0f6e7ef8660b70a9b90', '2026-03-24 07:49:31');
INSERT INTO `transfer_records` (`id`, `user_collection_id`, `collection_id`, `token_id`, `from_user_id`, `to_user_id`, `type`, `chain_hash`, `created_at`) VALUES (2, 2, 1, 2, NULL, 3, 'purchase', '0x1134fa0de73fe29032a1d43ffa1b55510d0cae7fb16c2139621efba4d279e4c4', '2026-03-24 08:04:01');
INSERT INTO `transfer_records` (`id`, `user_collection_id`, `collection_id`, `token_id`, `from_user_id`, `to_user_id`, `type`, `chain_hash`, `created_at`) VALUES (3, 3, 1, 3, NULL, 4, 'purchase', '0xd406bc873933e4dcd4049f4408cdef236ba73c3a31b4481da9b252439e550488', '2026-03-24 08:20:08');
INSERT INTO `transfer_records` (`id`, `user_collection_id`, `collection_id`, `token_id`, `from_user_id`, `to_user_id`, `type`, `chain_hash`, `created_at`) VALUES (4, 1, 1, 1, 2, 4, 'gift', '0x4f66af20a9696244d5a78a9230d656bb974a14e235c87f23d7751c5ba71a98f0', '2026-03-24 09:40:40');
INSERT INTO `transfer_records` (`id`, `user_collection_id`, `collection_id`, `token_id`, `from_user_id`, `to_user_id`, `type`, `chain_hash`, `created_at`) VALUES (5, 4, 5, 1, NULL, 2, 'purchase', '0xbda9c3844aec9ea7f9b5807560e0281ef4ba662e120bee48e4eee4965191645a', '2026-03-25 01:37:32');
COMMIT;

-- ----------------------------
-- Table structure for user_collections
-- ----------------------------
DROP TABLE IF EXISTS `user_collections`;
CREATE TABLE `user_collections` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` int unsigned NOT NULL COMMENT '持有者ID',
  `collection_id` int unsigned NOT NULL COMMENT '藏品ID',
  `token_id` int unsigned NOT NULL COMMENT '藏品编号（如 #0001）',
  `chain_hash` varchar(66) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '该实例的链上哈希',
  `acquire_type` enum('purchase','gift','airdrop') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'purchase' COMMENT '获取方式',
  `acquire_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '获取时间',
  `is_transferable` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否可转赠（冷却期后可转）',
  `transfer_cooldown_at` datetime DEFAULT NULL COMMENT '可转赠时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_collection_id` (`collection_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户藏品持有表';

-- ----------------------------
-- Records of user_collections
-- ----------------------------
BEGIN;
INSERT INTO `user_collections` (`id`, `user_id`, `collection_id`, `token_id`, `chain_hash`, `acquire_type`, `acquire_time`, `is_transferable`, `transfer_cooldown_at`, `created_at`) VALUES (1, 4, 1, 1, '0x7ce54590e5e5cc3d9d42d10f2bc6c265ec2d36505f21f0f6e7ef8660b70a9b90', 'gift', '2026-03-24 09:40:40', 0, '2026-03-27 09:40:40', '2026-03-24 07:49:31');
INSERT INTO `user_collections` (`id`, `user_id`, `collection_id`, `token_id`, `chain_hash`, `acquire_type`, `acquire_time`, `is_transferable`, `transfer_cooldown_at`, `created_at`) VALUES (2, 3, 1, 2, '0x1134fa0de73fe29032a1d43ffa1b55510d0cae7fb16c2139621efba4d279e4c4', 'purchase', '2026-03-24 08:04:01', 0, '2026-03-27 08:04:01', '2026-03-24 08:04:01');
INSERT INTO `user_collections` (`id`, `user_id`, `collection_id`, `token_id`, `chain_hash`, `acquire_type`, `acquire_time`, `is_transferable`, `transfer_cooldown_at`, `created_at`) VALUES (3, 4, 1, 3, '0xd406bc873933e4dcd4049f4408cdef236ba73c3a31b4481da9b252439e550488', 'purchase', '2026-03-24 08:20:08', 0, '2026-03-27 08:20:08', '2026-03-24 08:20:08');
INSERT INTO `user_collections` (`id`, `user_id`, `collection_id`, `token_id`, `chain_hash`, `acquire_type`, `acquire_time`, `is_transferable`, `transfer_cooldown_at`, `created_at`) VALUES (4, 2, 5, 1, '0xbda9c3844aec9ea7f9b5807560e0281ef4ba662e120bee48e4eee4965191645a', 'purchase', '2026-03-25 01:37:32', 0, '2026-03-28 01:37:32', '2026-03-25 01:37:32');
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '邮箱（登录账号）',
  `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码（bcrypt加密）',
  `phone` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号',
  `nickname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像URL',
  `bio` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '个人简介',
  `wallet_address` varchar(42) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '数字钱包地址',
  `balance` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '钱包余额',
  `real_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '真实姓名（加密存储）',
  `id_card` varchar(18) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '身份证号（加密存储）',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否实名认证 0否 1是',
  `role` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user' COMMENT '角色 user普通用户 admin管理员',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态 0封禁 1正常',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_wallet` (`wallet_address`),
  UNIQUE KEY `uk_phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` (`id`, `email`, `password`, `phone`, `nickname`, `avatar`, `bio`, `wallet_address`, `balance`, `real_name`, `id_card`, `is_verified`, `role`, `status`, `created_at`, `updated_at`) VALUES (1, 'admin@qq.com', '$2b$10$AbZGZhCbkw9tuwlFwU.YNeIJFCYH2AphWe41oGtLFvLgaWghyaMHi', NULL, '管理员', NULL, NULL, '0xADMIN0000000000000000000000000000000000', 0.00, NULL, NULL, 1, 'admin', 1, '2026-03-24 15:47:20', '2026-03-24 15:47:20');
INSERT INTO `users` (`id`, `email`, `password`, `phone`, `nickname`, `avatar`, `bio`, `wallet_address`, `balance`, `real_name`, `id_card`, `is_verified`, `role`, `status`, `created_at`, `updated_at`) VALUES (2, 'user@qq.com', '$2b$10$AbZGZhCbkw9tuwlFwU.YNeIJFCYH2AphWe41oGtLFvLgaWghyaMHi', NULL, 'user', NULL, NULL, '0xUSER00000000000000000000000000000000001', 7902.00, NULL, NULL, 1, 'user', 1, '2026-03-24 15:47:20', '2026-03-25 01:37:32');
INSERT INTO `users` (`id`, `email`, `password`, `phone`, `nickname`, `avatar`, `bio`, `wallet_address`, `balance`, `real_name`, `id_card`, `is_verified`, `role`, `status`, `created_at`, `updated_at`) VALUES (3, 'test@qq.com', '$2b$10$UzskaR0qXtsw1hBKX3T/GuLY65VAc2sLa.3K2zMQ4ReHxFZe2xML2', NULL, 'test', NULL, NULL, '0x56e46c05291b7e400e320a68ce28a812128c5c37', 99901.00, 'yuoua', '43312419551225551X', 1, 'user', 1, '2026-03-24 08:03:07', '2026-03-24 08:04:01');
INSERT INTO `users` (`id`, `email`, `password`, `phone`, `nickname`, `avatar`, `bio`, `wallet_address`, `balance`, `real_name`, `id_card`, `is_verified`, `role`, `status`, `created_at`, `updated_at`) VALUES (4, '2220841744@qq.com', '$2b$10$Ty8xoCiMv8Y9XAvjoOITZutF7UEotUu1fGGTLgjEYVnUcjkDHpXeS', NULL, '吴桐桐', NULL, NULL, '0x8b3605e6af0db31a3540ab47633d026702a7b093', 9901.00, '吴金锦', '150622200211188120', 1, 'user', 1, '2026-03-24 08:18:01', '2026-03-24 08:20:08');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
