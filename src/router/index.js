import Vue from 'vue'
import VueRouter from 'vue-router'
import todo from '../views/todo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'todo',
    component: todo
  },
  {
    path: '/finished',
    name: 'finished',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/finished.vue')
  },
  {
    path: '/add',
    name: 'add',
    component: () => import(/* webpackChunkName: "about" */ '../views/add.vue')
  }
]

const router = new VueRouter({
  routes
})

const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

export default router
