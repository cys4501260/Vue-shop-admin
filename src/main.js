import Vue from 'vue'
import App from './App.vue'
import router from './router'

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

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
