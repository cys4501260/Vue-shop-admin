import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import UserList from './views/UserList.vue'
import RoleList from './views/RoleList.vue'
import PermissionList from './views/PermissionList.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/users',
          component: UserList
        },
        {
          path: '/roles',
          component: RoleList
        },
        {
          path: '/rights',
          component: PermissionList
        }
      ]
    },
    
  ]
})
