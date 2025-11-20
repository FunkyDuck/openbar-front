// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    compatibilityDate: '2025-11-19',
    modules: ['@nuxtjs/tailwindcss'],
    nitro: {
        preset: 'node-server'
    },
    app: {
        head: {
            title: 'Open Bar - Découvrez le monde',
            meta: [
                { name: 'description', content: 'Exploration des meilleurs spiritueux du monde.' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' }
            ]
        }
    }
})