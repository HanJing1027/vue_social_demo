import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

export const useModalStore = defineStore('modal', () => {
  // 集中管理彈跳視窗狀態管理
  const modals = ref({
    postUpload: false,
    postDetails: false,
    // 其他可以在這繼續添加
  })

  const isAnyModalOpen = computed(() => {
    // 檢查是否有任何彈跳視窗是開啟的
    return Object.values(modals.value).some((isOpen) => isOpen)
  })

  // 打開指定的彈跳視窗
  const openModal = (modalName) => {
    if (modalName in modals.value) {
      modals.value[modalName] = true
    }
  }

  // 關閉指定的彈跳視窗
  const closeModal = (modalName) => {
    if (modalName in modals.value) {
      modals.value[modalName] = false
    }
  }

  // 關閉所有彈跳視窗
  const closeAllModals = () => {
    Object.keys(modals.value).forEach((modalName) => {
      modals.value[modalName] = false
    })
  }

  // Esc 鍵關閉彈跳視窗
  const handleEscKey = (event) => {
    if (event.key === 'Escape') {
      closeAllModals()
    }
  }

  // 監聽彈跳窗開啟時禁止滾動與 Esc 鍵關閉
  watch(isAnyModalOpen, (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden' // 禁止滾動
      document.addEventListener('keydown', handleEscKey) // 監聽 Esc 鍵
    } else {
      document.body.style.overflow = '' // 恢復滾動
      document.removeEventListener('keydown', handleEscKey) // 移除 Esc 鍵監聽
    }
  })

  return {
    // 狀態
    modals,

    // 動作
    openModal,
    closeModal,
    closeAllModals,
  }
})
