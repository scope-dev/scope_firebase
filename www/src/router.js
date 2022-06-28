import { createRouter, createWebHistory} from 'vue-router'
import store from '@/store/index';
import functionsCall from "@/firebase/functions/callable";

import Home from '@/components/Home.vue'
import Test from '@/components/Test.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Home,
    },
    {
      path: '/test',
      name: 'test',
      component: Test,
    },
  ]
})

//全てのページ遷移で実行される関数
router.beforeEach((to, from, next) => {
  store.dispatch('expiredcheck').then(async ()=>{
    if (!store.state.keyExpired) {
      let res = await functionsCall.callNeGetKey()
      console.log('in router- ', res)
      if(res.status == 200){
        next({path: '/', query: { message: res.message }})
      }else if(res.status == 302){
        window.location.href = "/functions/neGetUid"
        next()
      }else{
        next({path: '/', query: { message: '認証エラー' }})
      }
    }else{
      next()
    }
  })
  
})
