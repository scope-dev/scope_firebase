import { fileURLToPath, URL } from "url";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    https:true,
    proxy: {
      '/neSession': {
           target: 'http://localhost:5001/scope-test-20326/us-central1/neSession',
           changeOrigin: true,
           secure: false,      
           ws: true,
       }
  }
  },
  plugins: [vue(),mkcert()]
})

