import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bulma/css/bulma.min.css'
import './assets/styles/dark.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
