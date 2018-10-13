const request = require('superagent').agent()
const Constants = require('./Constants.js')
const terminalImage = require('terminal-image')
const querystring = require('querystring')
const encodePostData = require('./SinaEncrypter.js')
const CookieJar = require('cookiejar')

class WeiboClient {
  constructor () {
    this.isLogin = false
  }

  async login (username, password) {
    let secureUsername = Buffer.from(username).toString('base64')
    // Pre Login
    let preLoginData = await request.get(`${Constants.WEIBO_PRE_LOGIN_URL}&su=${secureUsername}`)
      .timeout(Constants.TIMEOUT)
      .set('User-Agent', Constants.CHROME_USER_AGENT)
      .set('Referer', Constants.WEIBO_BASE_URL)

    if (!preLoginData.ok) {
      return false
    }
    // console.log(preLoginData.body.toString())
    preLoginData = JSON.parse(/\((.*)\)/.exec(preLoginData.body.toString())[1])
    if (preLoginData == null) {
      return false
    }
    // Captcha
    if (preLoginData.showpin === 1) {
      let captchaData = await request.get(Constants.WEIBO_CAPTCHA_URL(preLoginData.pcid))
        .timeout(Constants.TIMEOUT)
        .set('User-Agent', Constants.CHROME_USER_AGENT)
        .set('Referer', Constants.WEIBO_BASE_URL)
        .buffer()
      console.log(await terminalImage.buffer(captchaData.body))
      let captchaAnswer = await Constants.INPUT_CAPTCHA()
      preLoginData.captchaAnswer = captchaAnswer.captchaAnswer
    }
    let securePassword = encodePostData.encryptUserPassword(password, preLoginData.serverTime, preLoginData.nonce, preLoginData.pubkey)
    let postData = {
      'nonce': preLoginData.nonce,
      'rsakv': preLoginData.rsakv,
      'servertime': preLoginData.serverTime,
      'su': secureUsername,
      'sp': securePassword,
      'encoding': 'UTF-8',
      'entry': 'weibo',
      'from': '',
      'gateway': 1,
      'pagerefer': '',
      'prelt': 296,
      'pwencode': 'rsa2',
      'returntype': 'META',
      'savestate': 0,
      'service': 'miniblog',
      'sr': '1366*768',
      'url': 'http://weibo.com/ajaxlogin.php?framelogin=1&callback=parent.sinaSSOController.feedBackUrlCallBack',
      'useticket': 1,
      'vsnf': 1
    }
    if (preLoginData.showpin === 1) {
      postData['door'] = preLoginData.captchaAnswer
      postData['pcid'] = preLoginData.pcid
    }
    let loginData = await request.post(Constants.WEIBO_LOGIN_URL)
      .type('form')
      .timeout(Constants.TIMEOUT)
      .set('User-Agent', Constants.CHROME_USER_AGENT)
      .set('Accept-Language', Constants.CHROME_USER_AGENT)
      .set('Referer', Constants.WEIBO_BASE_URL)
      .set('Connection', 'Keep-Alive')
      .send(postData)

    if (!loginData.ok) {
      return false
    }
    // console.log(loginData.text)
    let finalLoginUrl = Constants.FINAL_LOGIN_URL_REG.exec(loginData.text)[1]
    let parsedFinalLoginUrl = querystring.parse(finalLoginUrl)
    // console.log(JSON.stringify(parsedFinalLoginUrl))
    if (parsedFinalLoginUrl.retcode !== '0') {
      return false
    }

    await request.get(finalLoginUrl)
      .timeout(Constants.TIMEOUT)
      .set('User-Agent', Constants.CHROME_USER_AGENT)
      .set('Referer', Constants.WEIBO_BASE_URL)
    this.Cookie = request.jar.getCookies(CookieJar.CookieAccessInfo.All)
    // console.log(JSON.stringify(this.Cookie))
    this.isLogin = true
  }
}

module.exports = WeiboClient
