import Aura from '@primevue/themes/aura';
import { fileURLToPath } from 'url'
import {fa} from "cronstrue/dist/i18n/locales/fa";

export default defineNuxtConfig({
  devtools: { enabled: false },
    app: {
        head: {
            // link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
            meta: [
                {
                    name: 'viewport',
                    content: 'viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
                },
                {
                    name: 'viewport',
                    content: 'initial-scale=1.0, width=device-width'
                }
            ]
        }
    },

  modules: [
      '@pinia/nuxt',
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    'nuxt-swiper',
    'nuxt-marquee',
  ],

  css: [
      '~/assets/styles/tailwind.css',
      '~/assets/styles/vars.css',
      '~/assets/styles/sass/style.sass',
      'primeicons/primeicons.css',
      'vue3-carousel/dist/carousel.css'
  ],
    ssr: false,

  primevue: {
    autoImport: true,
    importTheme: { from: '~/themes/theme.js' },
  },

  runtimeConfig: {
      public:{
          APIURL: 'http://127.0.0.1:8000',
          //APIURL: 'https://felfri.ru',
      }
  },

  compatibilityDate: '2024-11-28',
})