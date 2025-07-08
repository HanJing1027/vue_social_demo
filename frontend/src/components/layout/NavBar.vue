<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="logo">
        <img src="@/assets/logo.svg" alt="logo" />
      </router-link>

      <!-- 桌面版搜尋框 -->
      <div class="search-input desktop-search">
        <input type="text" placeholder="搜尋內容..." @change="searchPosts" />
        <i class="bx bx-search-alt"></i>
      </div>

      <div class="nav-items">
        <!-- 手機版搜尋按鈕 -->
        <button class="nav-item mobile-search-btn" title="搜尋" @click="toggleMobileSearch">
          <i class="bx bx-search-alt"></i>
        </button>

        <router-link to="/" class="nav-item" title="首頁">
          <i class="bx bxs-home"></i>
        </router-link>

        <button class="nav-item" title="發布內容" @click="handleCreatePost">
          <i class="bx bx-message-alt-add"></i>
        </button>

        <div class="profile-dropdown" @click="toggleProfileMenu" ref="profileDropdownRef">
          <TheAvatar :src="userStore?.user?.avatar" :width="40" :height="40" :fontSize="20" />
          <ul :class="{ open: isProfileMenuOpen }" class="profile-menu">
            <li><button @click="goToUserProfile">個人主頁</button></li>
            <li><button class="logout-btn" @click="handleLogout">登出</button></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 手機版搜尋框 -->
    <div class="mobile-search-container" :class="{ show: showMobileSearch }">
      <div class="mobile-search-input">
        <input
          type="text"
          placeholder="搜尋內容..."
          ref="mobileSearchInput"
          @change="searchPosts"
        />
        <button class="close-search-btn" @click="toggleMobileSearch">
          <i class="bx bx-x"></i>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import TheAvatar from '@/components/common/TheAvatar.vue'

import { useUserStore } from '@/stores/modules/userStore'
import { useModalStore } from '@/stores/modules/modalStore'
import { usePostStore } from '@/stores/modules/postStore'
import { useRouter } from 'vue-router'
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

const router = useRouter()
const userStore = useUserStore()
const modalStore = useModalStore()
const postStore = usePostStore()
const showMobileSearch = ref(false)
const mobileSearchInput = ref(null)
const isMobileSearch = ref(false)
const isProfileMenuOpen = ref(false)
const profileDropdownRef = ref(null) // 新增

const toggleProfileMenu = (event) => {
  event.stopPropagation()
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}

const goToUserProfile = () => {
  isProfileMenuOpen.value = false

  // 延遲路由跳轉，確保選單關閉動畫完成
  setTimeout(() => {
    router.push(`/profile/${userStore.user.id}`)
  }, 100)
}

const handleLogout = () => {
  isProfileMenuOpen.value = false
  userStore.logoutUser()
  router.push('/login')
}

// 在路由變更後關閉個人下拉選單
router.afterEach(() => {
  isProfileMenuOpen.value = false
})

// 改進的點擊外部關閉
const handleClickOutside = (event) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target)) {
    isProfileMenuOpen.value = false
  }
}

// 打開貼文上傳彈跳視窗
const handleCreatePost = () => {
  modalStore.openModal('postUpload')
}

const toggleMobileSearch = async () => {
  showMobileSearch.value = !showMobileSearch.value
  isMobileSearch.value = true

  if (showMobileSearch.value) {
    await nextTick()
    setTimeout(() => {
      mobileSearchInput.value?.focus()
    }, 50)
  }
}

// 搜尋貼文
const searchPosts = async (event) => {
  const keyword = event.target.value.trim()
  const isMobile = window.innerWidth <= 768

  if (isMobile) return

  if (isMobileSearch.value) {
    showMobileSearch.value = !showMobileSearch.value
  }

  if (keyword) {
    await postStore.searchPostsResult(keyword)
    router.push({ name: 'search_result', query: { keyword } })
  }

  event.target.value = ''
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;
@use '@/assets/styles/_mixins.scss' as *;

.navbar {
  background: $surface;
  border-bottom: 1px solid $border-color;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 9999;

  .navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
  }

  .logo {
    display: flex;
    align-items: center;
    text-decoration: none;

    img {
      height: 30px;
      width: auto;
    }
  }

  .search-input {
    position: relative;
    flex: 1;
    max-width: 500px;
    margin: 0 40px;

    input {
      @include base-input($borderRadius: 20px);
    }

    i {
      cursor: pointer;
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: $text-secondary;
      font-size: 18px;
      transition: all 0.25s ease;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;

      &:hover {
        color: $primary-color;
        background: rgba(var(--primary-color-rgb), 0.08);
        transform: translateY(-50%) scale(1.05);
      }
    }
  }

  .mobile-search-container {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: $surface;
    border-bottom: 1px solid $border-color;
    padding: 12px 16px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;

    &.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .mobile-search-input {
      position: relative;
      display: flex;
      align-items: center;

      input {
        @include base-input($borderRadius: 20px);
      }

      .close-search-btn {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
          background: $surface-alt;
        }

        i {
          font-size: 20px;
          color: $text-secondary;
        }
      }
    }
  }

  .nav-items {
    display: flex;
    align-items: center;
    gap: 16px;

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      border: none;
      background: transparent;
      cursor: pointer;
      transition: background-color 0.2s ease;
      text-decoration: none;
      color: $text-color;

      &:hover {
        background: $surface-hover;
      }

      i {
        font-size: 20px;
        color: $text-color;
      }

      &.mobile-search-btn {
        display: none;
      }
    }

    @media (hover: none) {
      .nav-item:hover {
        background: transparent;
      }
    }

    .profile-dropdown {
      position: relative;
      z-index: 1000;
      cursor: pointer;
      user-select: none;

      .profile-menu {
        position: absolute;
        top: 100%;
        right: 0;
        background: $surface;
        border: 1px solid $border-color;
        border-radius: 8px;
        box-shadow: 0 4px 12px $shadow-light;
        min-width: 140px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition:
          opacity 0.3s ease,
          transform 0.3s ease;
        margin-top: 8px;
        padding: 8px 0;
        list-style: none;

        &.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        li {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        button {
          width: 100%;
          padding: 10px 16px;
          background: transparent;
          border: none;
          color: $text-color;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.2s ease;

          &:hover {
            background: $surface-hover;
          }

          &.logout-btn {
            color: $danger-color;

            &:hover {
              background: $surface-danger;
            }
          }
        }
      }
    }
  }
}

@media (max-width: $tablet-breakpoint) {
  .navbar {
    .search-input {
      max-width: 350px;
      margin: 0 20px;
    }
  }
}

// 手機 (最大 768px)
@media (max-width: $mobile-breakpoint) {
  .navbar {
    .navbar-container {
      padding: 0 16px;
      height: 56px;
    }

    .logo {
      img {
        height: 26px;
      }
    }

    // 隱藏桌面版搜尋框
    .desktop-search {
      display: none;
    }

    .nav-items {
      gap: 8px;

      .nav-item {
        width: 36px;
        height: 36px;

        i {
          font-size: 18px;
        }

        // 顯示手機版搜尋按鈕
        &.mobile-search-btn {
          display: flex;
        }
      }

      .profile-dropdown {
        > i {
          width: 36px;
          height: 36px;
          font-size: 18px;
        }

        .profile-menu {
          right: -8px;
          min-width: 120px;

          li {
            a,
            button {
              padding: 8px 12px;
              font-size: 13px;
            }
          }
        }
      }
    }
  }
}

@media (max-width: $small-phone-breakpoint) {
  .navbar {
    .navbar-container {
      padding: 0 12px;
    }

    .nav-items {
      gap: 4px;

      .nav-item {
        width: 32px;
        height: 32px;

        i {
          font-size: 16px;
        }
      }

      .profile-dropdown {
        > i {
          width: 32px;
          height: 32px;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
