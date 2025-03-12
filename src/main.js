
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import './assets/main.css'

import App from './App.vue';
import router from './router';

const app = createApp(App); 
const pinia = createPinia();

app.use(router); 
app.use(pinia);  
app.mount('#app');


// 🔥 Registro del Service Worker 🔥
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registrado con éxito:', registration);
      })
      .catch(error => {
        console.error('❌ Error al registrar el Service Worker:', error);
      });
  });
}