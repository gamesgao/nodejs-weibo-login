const SinaSSOEncoder = require('./SinaSSOEncoder.js').SSOEncoder
// 加密用户密码
function encryptUserPassword (userPwd, serverTime, nonce, pubkey) {
  let RSAKey = new SinaSSOEncoder.RSAKey()
  RSAKey.setPublic(pubkey, '10001')
  let securePassword = RSAKey.encrypt([serverTime, nonce].join('\t') + '\n' + userPwd)
  return securePassword
}
exports.encryptUserPassword = encryptUserPassword
