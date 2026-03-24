/** 生成订单编号（ORD + 年月日时分秒 + 4位随机数） */
function generateOrderNo() {
  const now = new Date()
  const ts = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `ORD${ts}${rand}`
}

module.exports = { generateOrderNo }
