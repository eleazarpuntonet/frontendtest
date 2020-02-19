
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
window.apibasepath = 'http://testingbackend.com/api'
window.axios = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 50000,
  withCredentials: false,
  params: {} // do not remove this, its added to add params later in the config
})

window.axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
}
Vue.use(VueAxios, axios)

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
