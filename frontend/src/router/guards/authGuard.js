import { useUserStore } from '@/stores/modules/userStore'

export function authGuard(to, from) {
  const userStore = useUserStore()

  // 登入判斷
  if (to.meta.requiresAuth) {
    if (!userStore.isAuthenticated) {
      return { name: 'login' }
    }
  }

  // 如果已經登入，則不允許訪問 Login Page
  if (to.meta.guestOnly) {
    if (userStore.isAuthenticated) {
      return { name: 'home' } // 或者重定向到其他頁
    }
  }
}
