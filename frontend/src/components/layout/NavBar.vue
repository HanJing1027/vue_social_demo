<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="logo">
        <img src="@/assets/logo.svg" alt="logo" />
      </router-link>

      <!-- 桌面版搜尋框 -->
      <div class="search-input desktop-search">
        <input type="text" placeholder="搜尋內容..." />
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

        <div class="profile-dropdown">
          <TheAvatar :width="40" :height="40" :fontSize="20" />
          <ul class="profile-menu">
            <li><router-link to="/profile">個人主頁</router-link></li>
            <li><button class="logout-btn" @click="handleLogout">退出登出</button></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 手機版搜尋框 -->
    <div class="mobile-search-container" :class="{ show: showMobileSearch }">
      <div class="mobile-search-input">
        <input type="text" placeholder="搜尋內容..." ref="mobileSearchInput" />
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
import { useRouter } from 'vue-router'
import { ref, nextTick } from 'vue'

const router = useRouter()
const userStore = useUserStore()
const modalStore = useModalStore()
const showMobileSearch = ref(false)
const mobileSearchInput = ref(null)

// 打開貼文上傳彈跳視窗
const handleCreatePost = () => {
  modalStore.openModal('postUpload')
}

const toggleMobileSearch = async () => {
  showMobileSearch.value = !showMobileSearch.value

  if (showMobileSearch.value) {
    await nextTick()
    // 確保 DOM 更新後再 focus 輸入框
    setTimeout(() => {
      mobileSearchInput.value?.focus()
    }, 50)
  }
}

const handleLogout = () => {
  userStore.logoutUser()
  router.push('/login')
}
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
  z-index: 100;

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
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: $text-secondary;
      font-size: 18px;
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

    .profile-dropdown {
      position: relative;
      z-index: 1000;
      cursor: pointer;

      > i {
        transition: background-color 0.2s ease;

        &:hover {
          background: $surface-hover;
        }
      }

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
        transition: all 0.2s ease;
        margin-top: 8px;
        padding: 8px 0;
        list-style: none;

        li {
          a,
          button {
            display: block;
            width: 100%;
            padding: 10px 16px;
            text-decoration: none;
            color: $text-color;
            background: none;
            border: none;
            text-align: left;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s ease;

            &:hover {
              background: $surface-hover;
            }
          }

          .logout-btn {
            color: $danger-color;

            &:hover {
              background: $surface-danger;
            }
          }
        }
      }

      &:hover .profile-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
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
