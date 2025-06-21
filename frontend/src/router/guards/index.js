import { authGuard } from '@/router/guards/authGuard.js'

export function setupGuards(router) {
  router.beforeEach(authGuard)
}
