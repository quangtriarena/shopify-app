require('dotenv').config()

const {
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  HOST,
  SCOPES,
  WEBHOOKS,
  API_VERSION,
  PORT,
  BACKEND_PORT,
  BACKEND_URL,
  SHOP,
} = process.env

module.exports = {
  apps: [
    {
      script: 'npm',
      args: 'run serve',
      env_production: {
        NODE_ENV: 'production',
        SHOPIFY_API_KEY,
        SHOPIFY_API_SECRET,
        HOST,
        SCOPES,
        WEBHOOKS,
        API_VERSION,
        PORT,
        BACKEND_PORT,
        BACKEND_URL,
        SHOP,
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
}
