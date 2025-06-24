import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'
import { setupGuards } from './guards/index.js'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

setupGuards(router)

export default router
