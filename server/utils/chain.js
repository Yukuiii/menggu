const crypto = require('crypto')

/** 全局区块高度计数器 */
let blockHeight = 18000000

/** 生成模拟链上哈希（SHA-256） */
function generateChainHash(data) {
  const salt = crypto.randomBytes(16).toString('hex')
  const raw = `${data}:${Date.now()}:${salt}`
  return '0x' + crypto.createHash('sha256').update(raw).digest('hex')
}

/** 生成模拟合约地址（0x + 40位十六进制） */
function generateContractAddress() {
  return '0x' + crypto.randomBytes(20).toString('hex')
}

/** 获取并递增区块高度 */
function getNextBlockHeight() {
  return ++blockHeight
}

module.exports = { generateChainHash, generateContractAddress, getNextBlockHeight }
