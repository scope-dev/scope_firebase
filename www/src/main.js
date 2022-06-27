import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { router } from './router'
import middleware from "@grafikri/vue-middleware"
import store from "./store/index"

router.beforeEach(middleware({ store }))
createApp(App).use(router).use(store).mount('#app')
