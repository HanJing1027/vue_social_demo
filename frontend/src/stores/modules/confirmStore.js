import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useConfirmStore = defineStore('confirm', () => {
  const isVisible = ref(false)
  const title = ref('')
  const message = ref('')
  const confirmCallback = ref(null)
  const cancelCallback = ref(null)

  const showConfirm = ({
    title: dialogTitle = '確認',
    message: dialogMessage = '您確定要執行此操作嗎？',
    onConfirm = null,
    onCancel = null,
  }) => {
    title.value = dialogTitle
    message.value = dialogMessage
    confirmCallback.value = onConfirm
    cancelCallback.value = onCancel
    isVisible.value = true
  }

  // 確認
  const confirm = () => {
    isVisible.value = false
    if (confirmCallback.value) {
      confirmCallback.value()
    }
    reset()
  }

  // 取消
  const cancel = () => {
    isVisible.value = false
    if (cancelCallback.value) {
      cancelCallback.value()
    }
    reset()
  }

  const reset = () => {
    title.value = ''
    message.value = ''
    confirmCallback.value = null
    cancelCallback.value = null
  }

  // Esc 鍵關閉彈跳視窗
  const handleEscKey = (event) => {
    if (event.key === 'Escape') {
      cancel()
    }
  }

  // 監聽彈跳窗開啟時禁止滾動與 Esc 鍵關閉
  watch(isVisible, (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden' // 禁止滾動
      document.addEventListener('keydown', handleEscKey) // 監聽 Esc 鍵
    } else {
      document.body.style.overflow = '' // 恢復滾動
      document.removeEventListener('keydown', handleEscKey) // 移除 Esc 鍵監聽
    }
  })

  return {
    isVisible,
    title,
    message,
    showConfirm,
    confirm,
    cancel,
  }
})
