import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])

  const addToast = (message, type, duration = 3000) => {
    const id = Date.now() // 識別id 避免誤刪
    const toast = {
      id,
      type,
      message,
      duration,
    }

    toasts.value.push(toast)

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id) => {
    // 找到要刪除的 toast
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const showSuccess = (message) => {
    return addToast(message, 'success')
  }

  const showError = (message) => {
    return addToast(message, 'error')
  }

  return {
    // 狀態
    toasts,

    // 動作
    addToast,
    removeToast,
    showSuccess,
    showError,
  }
})
