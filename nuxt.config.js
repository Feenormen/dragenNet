module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: '/flexible.js',
        type: 'text/javascript',
        charset: 'utf-8'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['element-ui/lib/theme-chalk/index.css'],
  transition: {
    name: 'layout',
    mode: 'out-in'
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/element-ui'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    prefix: '/api',
    proxy: true
  },
  proxy: [
    [
      '/api',
      {
        target: 'http://dragon.heronight.cn',
        changeOrigin: true,
        // ogLevel: 'debug',
        pathRewrite: { '^/api/': '/' }
      }
    ]
  ],
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/],
    postcss: {
      plugins: {
        // 通过传递 false 来禁用插件
        'postcss-px2rem': { remUnit: 37.5 }
      },
      preset: {
        // 更改postcss-preset-env 设置
        autoprefixer: {
          // browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
        }
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
