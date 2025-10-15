import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config
import dotenv from 'dotenv'
dotenv.config()
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: true,
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_API_URL
    }
  },
  nitro: {
    preset: 'node-server', // o 'vercel', 'netlify', según tu hosting
    compressPublicAssets: true,
    minify: true,

    // Caché del servidor
    storage: {
      cache: {
        driver: 'fs', // o 'fs' si no tienes Redis
        // Si usas Redis:
        // host: process.env.REDIS_HOST,
        // port: process.env.REDIS_PORT,
      }
    },
    // Pre-renderizar páginas estáticas
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      ignore: ['/admin', '/api']
    }
  },
  build: {
    transpile: ['vuetify']
  },
  router: {
    // middleware: ['language-detector']
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    [
      '@storyblok/nuxt',
      {
        accessToken: process.env.NUXT_SECRET_STORYBLOK_TOKEN,
        bridge: true,
        devtools: true,
        cache: {
          clear: "auto",
          type: "memory"
        },
        // enableSudoMode: true,
        apiOptions: {
          region: '' // Set 'US" if your space is created in US region (EU default)
        }
      }
    ]
  ],
  devServer: {
    https: {
      // key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
      // cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),
      key: 'localhost-key.pem',
      cert: 'localhost.pem'
    },
    port: 3013
  },
  routeRules: {
    // This rule is effective only in development mode
    '/**': {
      headers: {
        'X-Frame-Options': 'ALLOW-FROM https://app.storyblok.com/'
      }
    }
  },
  typescript: {
    typeCheck: false
  },
  googleFonts: {
    families: {
      Montserrat: [400, 700, 900],
      'Titillium Web': [400, 700, 900],
    },
    display: 'swap',
    preload: true,
    prefetch: false, // Cambiado a false para mejorar rendimiento
    preconnect: true,
    download: true, // 👈 Descarga las fuentes localmente
    inject: true,
    base64: false
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vuetify': ['vuetify'],
            'storyblok': ['@storyblok/nuxt']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['vuetify', '@storyblok/nuxt']
    }
  }

})
