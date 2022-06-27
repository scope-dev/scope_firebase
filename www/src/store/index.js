import { createStore } from 'vuex'
import query from "../firebase/firestore/query";
import dateFnsFormat from "date-fns/format";

const store = createStore({
  state () {
    return {
      count: 1,
      keyExpired:true
    }
  },
  mutations: {
    increment (state) {
      state.count++
    },
    setExpire (state, data) {
      state.keyExpired = data.response
    }
  },
  actions: {
    async expiredcheck({ commit, dispatch }) {
      const keys = await query.getOne('config','ne_keys')
      const utc_now = Date.now() - new Date().getTimezoneOffset() * 60 * 1000
      //console.log('utc_now', utc_now ,'<','ac_key ',keys.access_token_end_date.toMillis())
      //console.log("utc_now",dateFnsFormat(utc_now, 'yyyy-MM-dd HH:mm:ss'), '<','ac_key ',dateFnsFormat(keys.access_token_end_date.toMillis(), 'yyyy-MM-dd HH:mm:ss'))
      if(utc_now < keys.access_token_end_date.toMillis() ){
       //console.log('期限内')
       commit('setExpire',{response: true})
       return true
      }else{
       //console.log('期限切れ')
       commit('setExpire',{response: false})
       return false
      }
    },
  },
})

export default store;