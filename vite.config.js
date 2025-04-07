import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa' //vite pwa para sw y manifest

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // Registra automáticamente el SW
      manifest: {
        name: "Alura Medical Services",
        short_name: "Alura",
        description: "Aplicación de gestión de citas médicas",
        theme_color: "#5B5EA7",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/Alura-icon192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/Alura-icon512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],
        screenshots: [
          {
            src: '/screenshot-wide.jpg',
            sizes: '1920x954',
            type: 'image/jpg',
            form_factor: 'wide'
          },
          {
            src: '/screenshot-mobile.jpg',
            sizes: '359x764',
            type: 'image/jpg'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst'
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst'
          },
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
