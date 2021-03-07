import redirectSSL from 'redirect-ssl'
const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://ratemystop.herokuapp.com'
    : 'http://localhost:3000'

export default {
  publicRuntimeConfig: {
    baseURL,
  },
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Global CSS
   */
  css: ['@/assets/scss/main.scss'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: ['@/plugins/fonts.client.js', '~/serverMiddleware/debug.js'],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/sentry',
    'nuxt-leaflet',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: `${baseURL}/api/v1`,
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
  serverMiddleware: [
    redirectSSL.create({
      enabled: process.env.NODE_ENV === 'production',
    }),
    // Will register file from project api directory to handle /api/* requires
    { path: '/api/v1', handler: '~/api/v1/index' },
    {
      path: '/qr',
      handler(req, res) {
        const url = req.url.split('/')
        res.writeHead(301, { Location: `/survey/${url[1]}` })
        res.end()
      },
    },
  ],
  auth: {
    redirect: {
      login: '/login', // default
      logout: '/', // default
      home: '/admin',
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/auth/login',
            method: 'post',
            propertyName: 'token',
          },
          logout: false,
          user: { url: '/auth/user', method: 'get', propertyName: 'user' },
        },
      },
      tokenType: 'bearer',
    },
  },
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
  },
  sentry: {
    initialize: process.env.NODE_ENV === 'production',
    dsn:
      'https://6e0106f21eb343188c047af216daa2f7@o311837.ingest.sentry.io/5418652',
  },
}
