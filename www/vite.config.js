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
      '/functions': {
           target: 'http://localhost:5001/scope-test-20326/us-central1/',
           changeOrigin: true,
           rewrite: (path) => path.replace(/^\/functions/, ''),
           secure: false
       }
    }
  },
  plugins: [vue(),mkcert()]
})

