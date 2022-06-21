const functions = require('firebase-functions')
const admin = require('firebase-admin')

const ne_base_host = 'https://base.next-engine.org'
const path_sign = '/users/sign_in/'
let redirect_url = ''

//local emulatorで実行テストするときはus-central1じゃないと動かない
let REGION = ''
//Emulator判定
if (process.env.FUNCTIONS_EMULATOR) {
  REGION = 'us-central1'
  redirect_url = 'http://'
}else{
  REGION = 'asia-northeast1'
  redirect_url = 'https://'
}

module.exports = functions.https.onRequest(async (req, res) => {
  //リダイレクトURLの作成
  redirect_url += req.headers.host + '/' + process.env.GCLOUD_PROJECT + '/' + REGION + '/neGetKey'
  const ne_signin_url = `${ne_base_host}${path_sign}?client_id=${process.env.NE_CLIENT_ID}&redirect_uri=${redirect_url}`
  res.redirect(ne_signin_url); 
});