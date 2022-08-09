import dotenv from 'dotenv'
dotenv.config({ path: './../../.env' })

console.log('VITE PROCESS')
console.log(`| SHOPIFY_API_KEY: ${process.env.SHOPIFY_API_KEY}`)
console.log(`| SHOPIFY_API_SECRET: ${process.env.SHOPIFY_API_SECRET}`)
console.log(`| HOST: ${process.env.HOST}`)
console.log(`| SCOPES: ${process.env.SCOPES}`)
console.log(`| WEBHOOKS: ${process.env.WEBHOOKS}`)
console.log(`| API_VERSION: ${process.env.API_VERSION}`)
console.log(`| PORT: ${process.env.PORT}`)
console.log(`| BACKEND_PORT: ${process.env.BACKEND_PORT}`)
console.log(`| SHOP: ${process.env.SHOP}`)
console.log(`| BACKEND_URL: ${process.env.BACKEND_URL}`)

import { defineConfig } from 'vite'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import react from '@vitejs/plugin-react'

if (
  process.env.npm_lifecycle_event === 'build' &&
  !process.env.CI &&
  !process.env.SHOPIFY_API_KEY
) {
  console.warn(
    '\nBuilding the frontend app without an API key. The frontend build will not run without an API key. Set the SHOPIFY_API_KEY environment variable when running the build command.\n',
  )
}

const proxyOptions = {
  target: `http://127.0.0.1:${process.env.BACKEND_PORT}`,
  changeOrigin: false,
  secure: true,
  ws: false,
}

const host = process.env.HOST ? process.env.HOST.replace(/https?:\/\//, '') : 'localhost'

let hmrConfig
if (host === 'localhost') {
  hmrConfig = {
    protocol: 'ws',
    host: 'localhost',
    port: 64999,
    clientPort: 64999,
  }
} else {
  hmrConfig = {
    protocol: 'wss',
    host: host,
    port: process.env.FRONTEND_PORT,
    clientPort: 443,
  }
}

export default defineConfig({
  root: dirname(fileURLToPath(import.meta.url)),
  plugins: [react()],
  define: {
    'process.env.SHOPIFY_API_KEY': JSON.stringify(process.env.SHOPIFY_API_KEY),
  },
  resolve: {
    preserveSymlinks: true,
  },
  server: {
    host: 'localhost',
    port: process.env.FRONTEND_PORT,
    hmr: hmrConfig,
    proxy: {
      '^/(\\?.*)?$': proxyOptions,
      '^/api(/|(\\?.*)?$)': proxyOptions,
    },
  },
})
