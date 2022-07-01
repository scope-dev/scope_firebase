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
      if(keys){
        if(utc_now < keys.access_token_end_date.toMillis() ){
          //console.log('期限内')
          commit('setExpire',{response: true})
          localStorage.setItem('at',keys.access_token)
          localStorage.setItem('rt',keys.refresh_token)
          return true
        }else{
          //console.log('期限切れ')
          commit('setExpire',{response: false})
          localStorage.removeItem('at');
          localStorage.removeItem('rt');
          return false
        }
      }else{ //config keyなし
        //localhostの場合はemulator functionsがhttpなのでproxyを使用する
        let redirect_url = location.origin.includes('localhost') ? location.origin + '/functions/neGetUid' : import.meta.env.VITE_FIB_FUNC_URL + '/neGetUid'        
        window.location.href = redirect_url
        return false
      }
    }
  }
})

export default store;