const functions = require('firebase-functions')
const admin = require('firebase-admin')
const db = admin.firestore()
const Timestamp = admin.firestore.Timestamp
const url = require('url')
const qs = require('qs')
const axios = require('axios')

const neKeysRef = db.collection('config').doc('ne_keys')

var params = {}

const ne_base_host = 'https://base.next-engine.org'
const path_sign = '/users/sign_in/'

const ne_api_host = 'https://api.next-engine.org'
const path_auth = '/api_neauth'
const path_cinfo = '/api_v1_login_company/info'

//local emulatorで実行テストするときはus-central1じゃないと動かない
//hostingのproxyもus-central1
let REGION = 'us-central1'
//Emulator判定
if (process.env.FUNCTIONS_EMULATOR) {
  http = 'http://'
}else{
  http = 'https://'
}
async function getKeys(par) {
  let queryStr = qs.stringify(par);
  const response = await axios.post(ne_api_host+path_auth,queryStr)
  params = {...params , ...{'access_token': response.data.access_token}}
  queryStr = qs.stringify(params);
  const result = await axios.post(ne_api_host+path_cinfo,queryStr)

  //日本時間が返ってくるので-9時間して標準時に変換(判定はローカルマシンのロケールを使用)-32400000
  result.data.access_token_end_date = Timestamp.fromMillis(Date.parse(result.data.access_token_end_date))
  result.data.refresh_token_end_date = Timestamp.fromMillis(Date.parse(result.data.refresh_token_end_date))
  return result.data
}

async function setKeys(data) {
  return await neKeysRef.set(data)
  .then((res)=>{
    functions.logger.log('Set Keys')
    return res
  })
  .catch((err)=>{
    functions.logger.log('not Set Keys', err)
    return err
  })
}

module.exports = functions.region(REGION).https.onRequest(async (req, res) => {
  try {
    const url_parse = url.parse(req.url, true)
    params = {...params , ...{'client_id': process.env.NE_CLIENT_ID}}
    params = {...params , ...{'client_secret': process.env.NE_CLIENT_SECRET}}
    if(url_parse.query.uid){ //ne認証ログイン後
      functions.logger.log('from UID!')

      params = {...params , ...{'uid': url_parse.query.uid}}
      params = {...params , ...{'state': url_parse.query.state}}
      getKeys(params).then((r)=>{
        setKeys(r).then((m)=>{
          res.redirect(process.env.SERVICE_HOST)
        })
        .catch((err)=>{
          res.json({
            response:false,
            message: err
          })
        })
      })
    } else {
      //戻り先は app host /functions/neGetUid
      const ne_signin_url = `${ne_base_host}${path_sign}?client_id=${process.env.NE_CLIENT_ID}`
      functions.logger.log("ne_signin_url:", ne_signin_url);
      res.redirect(ne_signin_url);
    }
  } catch (err) { 
    console.log('catch error', err)
    res.json({
      response:false,
      message: err
    })
  }
});