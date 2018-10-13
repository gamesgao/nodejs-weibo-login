const inquirer = require('inquirer')

const SSO_LOGIN_VERSION = '1.4.19'

module.exports = {
  WEIBO_SSO_LOGIN_VERSION: SSO_LOGIN_VERSION,
  WEIBO_PRE_LOGIN_URL: `http://login.sina.com.cn/sso/prelogin.php?entry=weibo&checkpin=1&callback=sinaSSOController.preloginCallBack&rsakt=mod&client=ssologin.js(v${SSO_LOGIN_VERSION})`,
  WEIBO_LOGIN_URL: `http://login.sina.com.cn/sso/login.php?client=ssologin.js(v${SSO_LOGIN_VERSION})`,
  WEIBO_BASE_URL: 'http://weibo.com/',
  WEIBO_CAPTCHA_URL: (PC_ID) => {
    return `http://login.sina.com.cn/cgi/pin.php?r=${Math.floor(Math.random() * 1e8)}&s=0&p=${PC_ID}`
  },
  CHROME_USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
  TIMEOUT: 5000,
  INPUT_CAPTCHA: () => inquirer.prompt([{
    type: 'input',
    message: 'Please input captcha',
    name: 'captchaAnswer'
  }]),
  FINAL_LOGIN_URL_REG: /location\.replace\((?:"|')(.*)(?:"|')\)/

}
