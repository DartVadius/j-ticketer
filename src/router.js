import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/Main.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/config',
      name: 'config',
      component: () => import(/* webpackChunkName: "config" */ './views/Config.vue')
    },
    {
      path: '/popup',
      name: 'popup',
      component: () => import(/* webpackChunkName: "popup" */ './views/Popup.vue')
    }]
})
