import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  // 集中管理彈跳視窗狀態管理
  const modals = ref({
    postUpload: false,
    postDetails: false,
    // 其他可以在這繼續添加
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

  return {
    // 狀態
    modals,

    // 動作
    openModal,
    closeModal,
    closeAllModals,
  }
})
