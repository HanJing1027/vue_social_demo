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

        <button class="nav-item" title="發布內容">
          <i class="bx bx-message-alt-add"></i>
        </button>

        <div class="profile-dropdown">
          <i class="bx bxs-user"></i>
          <ul class="profile-menu">
            <li><router-link to="/profile">個人主頁</router-link></li>
            <li><button class="logout-btn">退出登出</button></li>
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
import { ref, nextTick } from 'vue'

const showMobileSearch = ref(false)
const mobileSearchInput = ref(null)

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
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.navbar {
  background: #ffffff;
  border-bottom: 1px solid #e1e5e9;
  position: sticky;
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
      width: 100%;
      padding: 10px 40px 10px 16px;
      border: 1px solid #e1e5e9;
      border-radius: 20px;
      background: #f8f9fa;
      font-size: 14px;
      outline: none;
      transition: all 0.2s ease;

      &:focus {
        border-color: #007bff;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
      }

      &::placeholder {
        color: #6c757d;
      }
    }

    i {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
      font-size: 18px;
    }
  }

  .mobile-search-container {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: #ffffff;
    border-bottom: 1px solid #e1e5e9;
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
        flex: 1;
        padding: 12px 50px 12px 16px;
        border: 1px solid #e1e5e9;
        border-radius: 20px;
        background: #f8f9fa;
        font-size: 16px;
        outline: none;
        transition: all 0.2s ease;

        &:focus {
          border-color: #007bff;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        &::placeholder {
          color: #6c757d;
        }
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
          background: #f8f9fa;
        }

        i {
          font-size: 20px;
          color: #6c757d;
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
      color: #000000;

      &:hover {
        background: #ecf7ff;
      }

      i {
        font-size: 20px;
        color: #000000;
      }

      &.mobile-search-btn {
        display: none;
      }
    }

    .profile-dropdown {
      position: relative;
      cursor: pointer;

      > i {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #f8f9fa;
        font-size: 20px;
        color: #000000;
        transition: background-color 0.2s ease;

        &:hover {
          background: #ecf7ff;
        }
      }

      .profile-menu {
        position: absolute;
        top: 100%;
        right: 0;
        background: #ffffff;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
            color: #333333;
            background: none;
            border: none;
            text-align: left;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s ease;

            &:hover {
              background: #f8f9fa;
            }
          }

          .logout-btn {
            color: #dc3545;

            &:hover {
              background: #fff5f5;
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
