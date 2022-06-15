const functions = require('firebase-functions')
const admin = require('firebase-admin')
const https = require('https');
const url = require('url');

const ne_host = 'https://base.next-engine.org'
const path_sign = '/users/sign_in/'

//local emulatorで実行テストするときはus-central1じゃないと動かない
let REGION = 'asia-northeast1';
//Emulator判定
if (process.env.FUNCTIONS_EMULATOR) {
  REGION = 'us-central1';
}
// module.exports = functions.region(REGION).https.onCall(async (data, context) => {
//   response.send("Hello from Firebase!;");
// })

module.exports = functions.https.onRequest(async (req, res) => {
  const url_parse = url.parse(req.url, true);
  res.send(url_parse);
});