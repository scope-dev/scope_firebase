const functions = require('firebase-functions')
const admin = require('firebase-admin')
const FieldValue = admin.firestore.FieldValue
const Timestamp = admin.firestore.Timestamp
const url = require('url')
const qs = require('qs')
const db = admin.firestore()
const axios = require('axios')
const dateFnsFormat = require("date-fns/format");
const isAfter = require('date-fns/isAfter')

//var params = new URLSearchParams()
var params = {}

const neKeysRef = db.collection('config').doc('ne_keys')

const ne_api_host = 'https://api.next-engine.org'
const path_auth = '/api_neauth'
const path_cinfo = '/api_v1_login_company/info'

let REGION = undefined
let redirect_url = ''

//Emulator判定
functions.logger.log('process.env.FUNCTIONS_EMULATOR:', process.env.FUNCTIONS_EMULATOR)
if (process.env.FUNCTIONS_EMULATOR) {
  REGION = 'us-central1'
  http = 'http://'
}else{
  REGION = 'asia-northeast1'
  http = 'https://'
}

// async function redirectUrl(req) {
//   const ne_base_host = 'https://base.next-engine.org'
//   const path_sign = '/users/sign_in/'
//   redirect_url = http + req.headers.host + '/' + process.env.GCLOUD_PROJECT + '/' + REGION + '/neGetKey'
//   const ne_signin_url = `${ne_base_host}${path_sign}?client_id=${process.env.NE_CLIENT_ID}&redirect_uri=${redirect_url}`
//   functions.logger.log('Redirect !!')
//   console.log('Redirect !!')
//   return ne_signin_url
// }

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

async function refreshKeys(par) {
  let queryStr = qs.stringify(par);
  const result = await axios.post(ne_api_host+path_cinfo,queryStr)
  if(result.data.result == 'error'){
    functions.logger.log(result.data)
    //console.log(result.data)
    return result.data
  }else{
    //日本時間が返ってくるので-9時間して標準時に変換(判定はローカルマシンのロケールを使用)-32400000
    result.data.access_token_end_date = Timestamp.fromMillis(Date.parse(result.data.access_token_end_date))
    result.data.refresh_token_end_date = Timestamp.fromMillis(Date.parse(result.data.refresh_token_end_date))
    return result.data
  }
}

async function setKeys(data) {
    return await neKeysRef.set(data)
    .then((res)=>{
      functions.logger.log('Set Keys')
      console.log('Set Keys')
      return true
    })
    .catch((err)=>{
      functions.logger.log('not Set Keys', err)
      console.log('not Set Keys', err)
      return false
    })
}

module.exports = functions.region(REGION).https.onCall(async (data, context) => {
  try {
    const neKeys = await neKeysRef.get()
    if(neKeys.exists){
      const keys = await neKeys.data()
      // console.log("now-",dateFnsFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'))
      // console.log("Accesskey-",dateFnsFormat(keys.access_token_end_date.toMillis(), 'yyyy-MM-dd HH:mm:ss'))
      // console.log("Refleshkey-",dateFnsFormat(keys.refresh_token_end_date.toMillis(), 'yyyy-MM-dd HH:mm:ss'))
      // console.log("期限:",keys.refresh_token_end_date.toMillis() > new Date())
      if(keys.refresh_token_end_date.toMillis() > new Date()){  //リフレッシュ期限内か
        console.log("refresh期限有効")
        params = {...params , ...{'access_token': keys.access_token}}
        params = {...params , ...{'refresh_token': keys.refresh_token}}
        return await refreshKeys(params)
        .then(async (new_key)=>{
          let res = await setKeys(new_key)
          //console.log(res)
          if(res){
            return {
              status:200,
              message:"ne keyを保存しました"
            }
          }else{
            return {
              status:false,
              message: err
            }
          }
        })
        .catch((err)=>{
          return {
            status:false,
            message: err
          }
        })
        
      }else{
      functions.logger.log("期限切れ")
      console.log("期限切れ")
        return {
          status:302,
          message: "Please Redirect:"
        }
      }
    }else{ //accesskeyが保存されていない場合
      functions.logger.log('configなし初回')
      console.log('configなし初回')
      return {
        status:302,
        message: "Please Redirect:"
      }
    }
  } catch (err) { 
    return {
      status:false,
      message: err
    }
  }
})