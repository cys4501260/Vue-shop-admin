import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入axios
import axios from 'axios'

import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'

import './assets/css/index.css'

Vue.use(ElementUI);

Vue.config.productionTip = false

// 注册一个全局的导航守卫
router.beforeEach((to, from, next) => {
  // 登录页面处理
  if (to.path === '/login') {
    next()
    return
  }
  // 判断网页去向
  if (localStorage.getItem('token')) {
    next()
  } else {
    router.push('/login')
  }
})

// 将axios存储到vue的原型中,实现任何地方都可以使用axios,无需再引入($http是行内默认的写法)
Vue.prototype.$http = axios

// 注册一个全局的axios的url路径
axios.defaults.baseURL = "http://localhost:8888/api/private/v1/"

// 设置axios的请求拦截器,来解决每次发送请求的headers问题
axios.interceptors.request.use(function (config) {
  // config是发送请求时拦截到的所有信息
  // console.log(config)

  // 设置请求是必须传的headers
  config.headers.Authorization = localStorage.getItem('token')

  // return config 是必须要有的返回值
  return config;
})

// 设置axios的响应拦截器
axios.interceptors.response.use(function (response) {
  // console.log(response)
  if (response.data.meta.status === 401) {
    router.push('/login')
  }

  return response
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
