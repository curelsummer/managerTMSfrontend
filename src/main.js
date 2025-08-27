import Vue from 'vue'
import Febs from './FEBS'
import router from './router'
import Antd from 'ant-design-vue'
import store from './store'
import request from 'utils/request'
import db from 'utils/localstorage'
import VueApexCharts from 'vue-apexcharts'
import moment from 'moment'

import 'ant-design-vue/dist/antd.css'
import 'moment/locale/zh-cn'

// 配置 moment.js 为中文
moment.locale('zh-cn')

import 'utils/install'

Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(db)
Vue.use(VueApexCharts)

if (window.jsMind) {
  console.log('wind')
  Vue.prototype.jsMind = window.jsMind
}

Vue.component('apexchart', VueApexCharts)

Vue.use({
  install (Vue) {
    Vue.prototype.$db = db
  }
})

Vue.prototype.$post = request.post
Vue.prototype.$get = request.get
Vue.prototype.$put = request.put
Vue.prototype.$delete = request.delete
Vue.prototype.$export = request.export
Vue.prototype.$download = request.download
Vue.prototype.$upload = request.upload
Vue.prototype.$postJson = request.postJson
Vue.prototype.$putJson = request.putJson
Vue.prototype.$moment = moment

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(Febs)
}).$mount('#febs')
