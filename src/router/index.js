import Vue from 'vue'
import VueRouter from 'vue-router'
import tablausuarios from '@/components/tablaUsuarios.vue'
import reportes from '@/components/reportes.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Clientes',
    component: tablausuarios
  },
  {
    path: '/reportes',
    name: 'Reportes',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: reportes
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
