import { createApp } from 'vue'
import { createRouter, createWebHistory} from 'vue-router'
import Home from './components/Home.vue'
import Test from './components/Test.vue'

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
      }
    ]
  })
