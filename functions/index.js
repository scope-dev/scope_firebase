'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const db = admin.firestore()
const settings = { timestampsInSnapshots: true };
db.settings(settings);

const funcs = {
  neSession: './func/neSession'
};

const loadFunctions = (funcsObj) => {
  console.log('loadFunctions ' + process.env.FUNCTION_TARGET);
  for (const name in funcsObj) {
    // 全文じゃなくて前方一致にする
    // if (!process.env.FUNCTION_TARGET || process.env.FUNCTION_TARGET === name) {
    if (!process.env.FUNCTION_TARGET || process.env.FUNCTION_TARGET.startsWith(name)) {
      exports[name] = require(funcsObj[name])
    }
  }
};

loadFunctions(funcs);

