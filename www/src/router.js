import { createRouter, createWebHistory} from 'vue-router'
import store from '@/store/index';

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
  store.dispatch('expiredcheck').then((r)=>{
  if (!store.state.keyExpired) {
    let url = '/functions/neGetKey'
    fetch(url)
    .then(function (data) {
      return data.json()
    })
    .then(function (json) {
      console.log(json.message)
      if(json.response){
        next({path: '/', query: { message: json.message }})
      }
    })
    next()
  }
  next()
  })
  
})
