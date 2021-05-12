import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import variables from './scss/_variables.scss'
import VueCookies from 'vue3-cookies'

import 'element-plus/lib/theme-chalk/index.css';
import installElementPlus from './plugins/element'

import { dragscrollNext } from "vue-dragscroll";



const app = createApp(App)
installElementPlus(app)

app.directive("dragscroll", dragscrollNext);

app.use(VueCookies);
app.use(store).use(router).mount('#app')