import dotenv from 'dotenv'
dotenv.config({ path: './../.env' })

// console.log('WEB PROCESS')
// console.log(`| SHOPIFY_API_KEY: ${process.env.SHOPIFY_API_KEY}`)
// console.log(`| SHOPIFY_API_SECRET: ${process.env.SHOPIFY_API_SECRET}`)
// console.log(`| HOST: ${process.env.HOST}`)
// console.log(`| SCOPES: ${process.env.SCOPES}`)
// console.log(`| WEBHOOKS: ${process.env.WEBHOOKS}`)
// console.log(`| API_VERSION: ${process.env.API_VERSION}`)
// console.log(`| PORT: ${process.env.PORT}`)
// console.log(`| BACKEND_PORT: ${process.env.BACKEND_PORT}`)
// console.log(`| SHOP: ${process.env.SHOP}`)

// @ts-check
import { join } from 'path'
import fs from 'fs'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import bodyParser from 'body-parser'
import { Shopify, LATEST_API_VERSION } from '@shopify/shopify-api'

import applyAuthMiddleware from './middleware/auth.js'
import verifyRequest from './middleware/verify-request.js'
import { setupGDPRWebHooks } from './gdpr.js'
import productCreator from './helpers/product-creator.js'
import { BillingInterval } from './helpers/ensure-billing.js'
import { AppInstallations } from './app_installations.js'

import webhookRoute from './backend/routes/webhook/index.js'
import storeSettingRoute from './backend/routes/admin/store_setting.js'
import productRoute from './backend/routes/admin/product.js'
import billingRoute from './backend/routes/admin/billing.js'
import backgroundJobRoute from './backend/routes/admin/background_job.js'
import duplicatorRoute from './backend/routes/admin/duplicator.js'
import submitionRoute from './backend/routes/admin/submition.js'

const USE_ONLINE_TOKENS = false
const TOP_LEVEL_OAUTH_COOKIE = 'shopify_top_level_oauth'

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10)

// TODO: There should be provided by env vars
const DEV_INDEX_PATH = `${process.cwd()}/frontend/`
const PROD_INDEX_PATH = `${process.cwd()}/frontend/dist/`

const DB_PATH = `${process.cwd()}/database.sqlite`

const { POSTGRES_USER, POSTGRES_HOST, POSTGRES_DB, POSTGRES_PWD, POSTGRES_PORT } = process.env
const POSTGRES_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PWD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(','),
  HOST_NAME: process.env.HOST.replace(/https?:\/\//, ''),
  HOST_SCHEME: process.env.HOST.split('://')[0],
  API_VERSION: LATEST_API_VERSION,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  // SESSION_STORAGE: new Shopify.Session.SQLiteSessionStorage(DB_PATH),
  SESSION_STORAGE: new Shopify.Session.PostgreSQLSessionStorage(POSTGRES_URL),
})

Shopify.Webhooks.Registry.addHandler('APP_UNINSTALLED', {
  path: '/api/webhooks',
  webhookHandler: async (_topic, shop, _body) => {
    await AppInstallations.delete(shop)
  },
})

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const BILLING_SETTINGS = {
  required: false,
  // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
  // chargeName: "My Shopify One-Time Charge",
  // amount: 5.0,
  // currencyCode: "USD",
  // interval: BillingInterval.OneTime,
}

// This sets up the mandatory GDPR webhooks. You’ll need to fill in the endpoint
// in the “GDPR mandatory webhooks” section in the “App setup” tab, and customize
// the code when you store customer data.
//
// More details can be found on shopify.dev:
// https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks
setupGDPRWebHooks('/api/webhooks')

// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
  billingSettings = BILLING_SETTINGS,
) {
  const app = express()

  app.set('top-level-oauth-cookie', TOP_LEVEL_OAUTH_COOKIE)
  app.set('use-online-tokens', USE_ONLINE_TOKENS)

  app.use(cors())
  app.use(cookieParser(Shopify.Context.API_SECRET_KEY))

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  // -------------------------------------------
  /**
   * STOREFRONT ROUTES
   */
  // -------------------------------------------

  applyAuthMiddleware(app, { billing: billingSettings })

  webhookRoute(app, Shopify)

  // All endpoints after this point will require an active session
  app.use('/api/*', verifyRequest(app, { billing: billingSettings }))

  app.get('/api/products/create', async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get('use-online-tokens'))
    let status = 200
    let error = null

    try {
      await productCreator(session)
    } catch (e) {
      console.log(`Failed to process products/create: ${e.message}`)
      status = 500
      error = e.message
    }
    res.status(status).send({ success: status === 200, error })
  })

  // -------------------------------------------
  /**
   * ADMIN ROUTES
   */
  storeSettingRoute(app, Shopify)
  productRoute(app, Shopify)
  billingRoute(app, Shopify)
  backgroundJobRoute(app, Shopify)
  duplicatorRoute(app, Shopify)
  submitionRoute(app, Shopify)
  // -------------------------------------------

  // All endpoints after this point will have access to a request.body
  // attribute, as a result of the express.json() middleware
  app.use(express.json())

  app.use((req, res, next) => {
    const shop = Shopify.Utils.sanitizeShop(req.query.shop)
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        'Content-Security-Policy',
        `frame-ancestors https://${encodeURIComponent(shop)} https://admin.shopify.com;`,
      )
    } else {
      res.setHeader('Content-Security-Policy', `frame-ancestors 'none';`)
    }
    next()
  })

  if (isProd) {
    const compression = await import('compression').then(({ default: fn }) => fn)
    const serveStatic = await import('serve-static').then(({ default: fn }) => fn)
    app.use(compression())
    app.use(serveStatic(PROD_INDEX_PATH, { index: false }))
  }

  app.use('/*', async (req, res, next) => {
    // redirect install page
    if (req.baseUrl.includes('/install')) {
      const installFilePath = join(process.cwd(), 'public', 'install.html')
      return res.status(200).set('Content-Type', 'text/html').send(fs.readFileSync(installFilePath))
    }

    const shop = Shopify.Utils.sanitizeShop(req.query.shop)
    if (!shop) {
      res.status(500)
      return res.send('No shop provided')
    }

    const appInstalled = await AppInstallations.includes(shop)

    if (shop && !appInstalled) {
      res.redirect(`/api/auth?shop=${encodeURIComponent(shop)}`)
    } else {
      const fs = await import('fs')
      const fallbackFile = join(isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH, 'index.html')
      res.status(200).set('Content-Type', 'text/html').send(fs.readFileSync(fallbackFile))
    }
  })

  return { app }
}

createServer().then(({ app }) =>
  app.listen(PORT, () => {
    console.log('++++++++++++++++++++++++++++++++++++')
    console.log('+                                  +')
    console.log('+   Welcome to ArenaCommerce App   +')
    console.log('+                                  +')
    console.log('++++++++++++++++++++++++++++++++++++')
    console.log(`|`)
    console.log('| Install Link:')
    console.log(`| ${process.env.HOST}/install`)
    console.log(`|`)
    console.log('| Shopify Admin App:')
    console.log(`| ${process.env.HOST}/api/auth?shop=${process.env.SHOP}`)
    console.log(`|`)
  }),
)
