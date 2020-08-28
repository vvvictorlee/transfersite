/*
 Navicat Premium Data Transfer

 Source Server         : 127.0.0.1
 Source Server Type    : MySQL
 Source Server Version : 50610
 Source Host           : localhost:3306
 Source Schema         : eth_data

 Target Server Type    : MySQL
 Target Server Version : 50610
 File Encoding         : 65001

 Date: 28/08/2020 19:32:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for block_chain_data
-- ----------------------------
DROP TABLE IF EXISTS `block_chain_data`;
CREATE TABLE `block_chain_data` (
  `block` int(11) NOT NULL,
  `txnHash` varchar(70) COLLATE utf8_bin NOT NULL,
  `fromAddr` varchar(50) COLLATE utf8_bin NOT NULL,
  `toAddr` varchar(50) COLLATE utf8_bin NOT NULL,
  `amount` decimal(50,0) NOT NULL,
  `eventName` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `token` varchar(50) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`txnHash`,`toAddr`) USING BTREE,
  KEY `idxBlock` (`block`) USING BTREE,
  KEY `idxTo` (`toAddr`) USING HASH,
  KEY `idxFrom` (`fromAddr`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for block_chain_pool
-- ----------------------------
DROP TABLE IF EXISTS `block_chain_pool`;
CREATE TABLE `block_chain_pool` (
  `block` int(11) NOT NULL,
  `txnHash` varchar(70) COLLATE utf8_bin NOT NULL,
  `reserve0` decimal(50,0) NOT NULL,
  `reserve1` decimal(50,0) NOT NULL,
  `eventName` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `token` varchar(50) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`txnHash`,`token`) USING BTREE,
  KEY `idxBlock` (`block`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='流动池快照';

-- ----------------------------
-- Table structure for mining_data
-- ----------------------------
DROP TABLE IF EXISTS `mining_data`;
CREATE TABLE `mining_data` (
  `cycle` int(10) DEFAULT NULL,
  `block` int(11) NOT NULL,
  `addr` varchar(50) COLLATE utf8_bin NOT NULL,
  `s_token` varchar(50) COLLATE utf8_bin NOT NULL,
  `s_balance` decimal(50,0) NOT NULL DEFAULT '0',
  `p_token` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `p_balance` decimal(50,0) NOT NULL DEFAULT '0',
  `p_unclaimed` decimal(50,0) NOT NULL DEFAULT '0',
  `p_awards` decimal(50,0) NOT NULL DEFAULT '0',
  `swp_awards` decimal(50,0) NOT NULL DEFAULT '0',
  PRIMARY KEY (`block`,`addr`,`s_token`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for snapshot_block
-- ----------------------------
DROP TABLE IF EXISTS `snapshot_block`;
CREATE TABLE `snapshot_block` (
  `cycle` int(10) DEFAULT NULL,
  `block` int(11) NOT NULL,
  `addr` varchar(50) COLLATE utf8_bin NOT NULL,
  `token` varchar(50) COLLATE utf8_bin NOT NULL,
  `balance` decimal(50,0) NOT NULL,
  PRIMARY KEY (`block`,`addr`,`token`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for token_list
-- ----------------------------
DROP TABLE IF EXISTS `token_list`;
CREATE TABLE `token_list` (
  `block` int(11) DEFAULT NULL,
  `sToken` varchar(50) COLLATE utf8_bin NOT NULL,
  `pToken` varchar(50) COLLATE utf8_bin NOT NULL,
  `token0` varchar(50) COLLATE utf8_bin NOT NULL,
  `token1` varchar(50) COLLATE utf8_bin NOT NULL,
  `verified` int(1) NOT NULL DEFAULT '0',
  `vBlock` int(11) DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`sToken`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for token_supply
-- ----------------------------
DROP TABLE IF EXISTS `token_supply`;
CREATE TABLE `token_supply` (
  `block` int(11) NOT NULL,
  `token` varchar(50) COLLATE utf8_bin NOT NULL,
  `supply` decimal(50,0) NOT NULL DEFAULT '0',
  `pool_usdt` decimal(50,0) NOT NULL DEFAULT '0',
  `verified` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`block`,`token`) USING BTREE,
  KEY `idxBlock` (`block`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

SET FOREIGN_KEY_CHECKS = 1;
