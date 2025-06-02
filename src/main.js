import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/config'
import '../public/main.css';

let app

onAuthStateChanged(auth, (_user) => {
    if (!app) {
        app = createApp(App)
        .use(router)
        .use(createPinia())
        .mount('#app')
    }
  })