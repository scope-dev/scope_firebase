import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: "./",
  server: {
    hmr:{
      host: true,
      port: 5000
    }
  },
  plugins: [vue()]
})