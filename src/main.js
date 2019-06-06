import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import service from './utils/request'
// import axios from 'axios'

import '@/icons' // icon
import '@/permission' // permission control
import 'default-passive-events'
/**
 * This project originally used easy-mock to simulate data,
 * but its official service is very unstable,
 * and you can build your own service if you need it.
 * So here I use Mock.js for local emulation,
 * it will intercept your request, so you won't see the request in the network.
 * If you remove `../mock` it will automatically request easy-mock data.
 */
// import '../mock' // simulation data
// import echarts from 'echarts'
Vue.use(ElementUI, { locale })
// import { Message, MessageBox } from 'element-ui'
// Vue.use(echarts)
// Vue.prototype.$http = axios
Vue.prototype.$http = service
// Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
// echarts.init(document.getElementById('report'))
