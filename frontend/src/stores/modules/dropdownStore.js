import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDropdownStore = defineStore('dropdown', () => {
  const activeDropdownId = ref(null)

  // 開啟 menu
  const openDropdown = (id) => {
    activeDropdownId.value = id
  }

  // 關閉 menu
  const closeDropdown = () => {
    activeDropdownId.value = null
  }

  // 切換 menu 狀態
  const toggleDropdown = (id) => {
    if (activeDropdownId.value === id) {
      closeDropdown()
    } else {
      openDropdown(id)
    }
  }

  const isDropdownOpen = (id) => {
    return activeDropdownId.value === id
  }

  return {
    activeDropdownId,

    openDropdown,
    closeDropdown,
    toggleDropdown,
    isDropdownOpen,
  }
})
