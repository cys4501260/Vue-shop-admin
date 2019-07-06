import Vue from 'vue'
import Router from 'vue-router'

// 路游懒加载
const Login =  () => import('./views/Login.vue')
const Home =  () => import('./views/Home.vue')
const UserList =  () => import('./views/UserList.vue')
const RoleList =  () => import('./views/RoleList.vue')
const PermissionList =  () => import('./views/PermissionList.vue')
const GoodsList =  () => import('./views/GoodsList.vue')
const GoodsClassify =  () => import('./views/GoodsClassify.vue')
const AddGoods =  () => import('./views/AddGoods.vue')

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
        },
        {
          path: '/goods',
          component: GoodsList
        },
        {
          path: '/categories',
          component: GoodsClassify
        },
        {
          path: '/goods-add',
          component: AddGoods
        },
      ]
    },
    
  ]
})
