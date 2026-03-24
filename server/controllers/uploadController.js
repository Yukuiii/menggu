const { success, fail } = require('../utils/response')

/** 上传封面图 */
exports.uploadCover = async (req, res, next) => {
  try {
    if (!req.file) return fail(res, '请选择要上传的封面图')
    const url = `/uploads/covers/${req.file.filename}`
    success(res, { url, fileSize: req.file.size }, '封面上传成功')
  } catch (err) { next(err) }
}

/** 上传藏品原始文件 */
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) return fail(res, '请选择要上传的文件')
    const url = `/uploads/files/${req.file.filename}`
    success(res, { url, fileSize: req.file.size }, '文件上传成功')
  } catch (err) { next(err) }
}
