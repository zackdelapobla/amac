// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxtjs/tailwindcss'
  ],
  app: {
    head: {
      title: 'AMAC - Flora Nativa de Peralillo',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Agrupación Medioambiental Cañetenes - Difusión de flora nativa' },
      ],
      htmlAttrs: { lang: 'es' },
    },
  },
  runtimeConfig: {
    public: {
      // "https://api.amacperalillo.com/api"
      apiBase: 'http://localhost:4000/api'
    },
  },
})