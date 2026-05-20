import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import { createPinia } from 'pinia'
import 'primeicons/primeicons.css'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import AOS from 'aos'
import 'aos/dist/aos.css'

const app = createApp(App)

app
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        prefix: 'p',
        cssLayer: true,
      },
    },
  })
  .use(createPinia())
  .use(ToastService)

app.mount('#app')

AOS.init()