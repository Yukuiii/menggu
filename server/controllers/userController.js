const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')
const config = require('../config')
const { success, fail } = require('../utils/response')

/** 生成模拟数字钱包地址（0x + 40位十六进制）*/
function generateWalletAddress() {
  const chars = '0123456789abcdef'
  let addr = '0x'
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)]
  }
  return addr
}

/** 用户注册（邮箱 + 密码 + 昵称）*/
exports.register = async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body

    // 参数校验
    if (!email || !password) {
      return fail(res, '邮箱和密码不能为空')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail(res, '邮箱格式不正确')
    }
    if (password.length < 6) {
      return fail(res, '密码至少6位')
    }

    // 检查邮箱是否已存在
    const exist = await User.findOne({ where: { email } })
    if (exist) {
      return fail(res, '该邮箱已注册')
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户（自动生成钱包地址）
    const user = await User.create({
      email,
      password: hashedPassword,
      nickname: nickname || email.split('@')[0],
      walletAddress: generateWalletAddress()
    })

    success(res, { id: user.id, email: user.email, nickname: user.nickname }, '注册成功')
  } catch (err) { next(err) }
}

/** 用户登录（邮箱 + 密码）*/
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return fail(res, '邮箱和密码不能为空')
    }

    // 查找用户
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return fail(res, '账号或密码错误')
    }

    // 检查封禁状态
    if (user.status === 0) {
      return fail(res, '账号已被封禁，请联系客服')
    }

    // 校验密码
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return fail(res, '账号或密码错误')
    }

    // 签发 JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    )

    success(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        walletAddress: user.walletAddress,
        isVerified: user.isVerified
      }
    }, '登录成功')
  } catch (err) { next(err) }
}

/** 获取当前登录用户详情 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      // 排除密码字段
      attributes: { exclude: ['password'] }
    })
    if (!user) {
      return fail(res, '用户不存在')
    }
    success(res, user)
  } catch (err) { next(err) }
}

/** 实名认证 */
exports.verify = async (req, res, next) => {
  try {
    const { realName, idCard } = req.body
    if (!realName || !idCard) {
      return fail(res, '姓名和身份证号不能为空')
    }
    // 简单校验身份证格式（18位）
    if (!/^\d{17}[\dXx]$/.test(idCard)) {
      return fail(res, '身份证号格式不正确')
    }

    await User.update(
      { realName, idCard, isVerified: true },
      { where: { id: req.userId } }
    )
    success(res, null, '实名认证成功')
  } catch (err) { next(err) }
}
