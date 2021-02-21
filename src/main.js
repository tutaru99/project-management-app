import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'element-plus/lib/theme-chalk/index.css';
import installElementPlus from './plugins/element'


const app = createApp(App)
installElementPlus(app)
app.use(store).use(router).mount('#app')