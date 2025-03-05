import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Oruga from '@oruga-ui/oruga-next'
import '@oruga-ui/oruga-next/dist/oruga.css'
import 'bulma/css/bulma.min.css'
import './assets/styles/dark.css'

const app = createApp(App)

app.use(router)
app.use(Oruga)

app.mount('#app')
