const functions = require('firebase-functions')
const admin = require('firebase-admin')

const ne_base_host = 'https://base.next-engine.org'
const path_sign = '/users/sign_in/'
let redirect_url = ''

//local emulatorで実行テストするときはus-central1じゃないと動かない
let REGION = undefined
//Emulator判定
if (process.env.FUNCTIONS_EMULATOR) {
  REGION = 'us-central1'
  http = 'http://'
}else{
  REGION = 'asia-northeast1'
  http = 'https://'
}

module.exports = functions.region(REGION).https.onRequest(async (req, res) => {
  //リダイレクトURLの作成
  redirect_url = http + req.headers.host + '/' + process.env.GCLOUD_PROJECT + '/' + REGION + '/neGetKey'
  console.log(process.env)
  console.log(req.headers)
  console.log('リダイレクトURL:', redirect_url)

  const ne_signin_url = `${ne_base_host}${path_sign}?client_id=${process.env.NE_CLIENT_ID}&redirect_uri=${redirect_url}`
  res.redirect(ne_signin_url); 
});