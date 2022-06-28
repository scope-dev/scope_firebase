const functions = require('firebase-functions')
const admin = require('firebase-admin')
const FieldValue = admin.firestore.FieldValue
const Timestamp = admin.firestore.Timestamp
const https = require('https')
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
if (process.env.FUNCTIONS_EMULATOR) {
  REGION = 'us-central1'
  http = 'http://'
}else{
  REGION = 'asia-northeast1'
  http = 'https://'
}

async function redirectUrl(req) {
  const ne_base_host = 'https://base.next-engine.org'
  const path_sign = '/users/sign_in/'
  redirect_url = http + req.headers.host + '/' + process.env.GCLOUD_PROJECT + '/' + REGION + '/neGetKey'
  const ne_signin_url = `${ne_base_host}${path_sign}?client_id=${process.env.NE_CLIENT_ID}&redirect_uri=${redirect_url}`
  console.log('Redirect !!', ne_signin_url)
  return ne_signin_url
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

async function refreshKeys(par) {
  let queryStr = qs.stringify(par);
  const result = await axios.post(ne_api_host+path_cinfo,queryStr)
  if(result.data.result == 'error'){
    throw result.data.message
  }else{
    //日本時間が返ってくるので-9時間して標準時に変換(判定はローカルマシンのロケールを使用)-32400000
    result.data.access_token_end_date = Timestamp.fromMillis(Date.parse(result.data.access_token_end_date))
    result.data.refresh_token_end_date = Timestamp.fromMillis(Date.parse(result.data.refresh_token_end_date))
    return result.data
  }
}

async function setKeys(data) {
    await neKeysRef.set(data)
    .then((res)=>{
      console.log('Set Keys')
      return res
    })
    .catch((err)=>{
      console.log('Set Keys', err)
      return err
    })
}

module.exports = functions.region(REGION).https.onRequest(async (req, res) => {
  try {
    if (res.method === 'OPTIONS') {
      console.log('OPTIONS', req)
      res.set('Access-Control-Allow-Headers', "authorization,content-type,application/json");
      res.set('Access-Control-Allow-Origin', '*');
      rse.status(204).send('');
    } else {
        
      const url_parse = url.parse(req.url, true)
      params = {...params , ...{'client_id': process.env.NE_CLIENT_ID}}
      params = {...params , ...{'client_secret': process.env.NE_CLIENT_SECRET}}
      res.set('Access-Control-Allow-Origin', '*');
      if(url_parse.query.uid){ //ne認証ログイン後
        console.log('from UID!')     

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
          
      }else{
        const neKeys = await neKeysRef.get()
        if(neKeys.exists){
          const keys = await neKeys.data()

          console.log("key有効期限")
          console.log("now-",dateFnsFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'))
          console.log("Accesskey-",dateFnsFormat(keys.access_token_end_date.toMillis(), 'yyyy-MM-dd HH:mm:ss'))
          console.log("Refleshkey-",dateFnsFormat(keys.refresh_token_end_date.toMillis(), 'yyyy-MM-dd HH:mm:ss'))
          console.log("期限:",keys.refresh_token_end_date.toMillis() > new Date())
          if(keys.refresh_token_end_date.toMillis() > new Date()){  //リフレッシュ期限内か
            console.log("refresh期限有効")
            params = {...params , ...{'access_token': keys.access_token}}
            params = {...params , ...{'refresh_token': keys.refresh_token}}
            refreshKeys(params).then((r)=>{
              //console.log(r)
              setKeys(r).then((m)=>{
                res.json({
                  response:true,
                  message:"ne keyを保存しました"
                })
              })
              .catch((err)=>{
                res.json({
                  response:false,
                  message: err
                })
              })
            })
            .catch((err)=>{
              res.json({
                response:false,
                message: err
              })
            })

          }else{
            console.log("期限切れ")
            redirectUrl(req).then((r)=>{
              console.log(r)
              res.json({
                response:false,
                redirect: r,
                message: "Please Redirect:"
              })
            })
          }
        }else{ //accesskeyが保存されていない場合
          console.log('configなし初回')
          redirectUrl(req).then((r)=>{
            res.json({
              response:false,
              redirect: r,
              message: "Please Redirect:"
            })
          })
        }
      }
    }
  } catch (err) { 
    res.json({
      response:false,
      message: err
    })
  }
})