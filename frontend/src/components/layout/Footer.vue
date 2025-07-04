<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <!-- 左側：品牌資訊 -->
        <div class="footer-section">
          <h3 class="footer-title">MiVida</h3>
          <p class="footer-description">連結世界，分享生活</p>
        </div>

        <!-- 中間：導航連結 -->
        <div class="footer-section">
          <h4 class="footer-subtitle">快速導航</h4>
          <ul class="footer-links">
            <li><router-link to="/" class="footer-link">首頁</router-link></li>
            <li>
              <router-link :to="`/profile/${userId}`" class="footer-link">個人檔案</router-link>
            </li>
          </ul>
        </div>

        <!-- 右側：幫助支援 -->
        <div class="footer-section">
          <h4 class="footer-subtitle">幫助與支援</h4>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">常見問題</a></li>
            <li><a href="#" class="footer-link">使用教學</a></li>
          </ul>
        </div>
      </div>

      <!-- 底部版權資訊 -->
      <div class="footer-bottom">
        <div class="copyright">
          <p>&copy; 2025 Huang Hanjing. All rights reserved.</p>
        </div>
        <div class="footer-policies">
          <a href="#" class="policy-link">隱私政策</a>
          <span class="divider">|</span>
          <a href="#" class="policy-link">服務條款</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/modules/userStore'

const userStore = useUserStore()

const userId = computed(() => {
  return userStore.user?.id || ''
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.footer {
  background: $surface-alt;
  border-top: 1px solid $border-color;
  margin-top: auto;

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px 20px;
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 32px;
    margin-bottom: 32px;

    @media (max-width: $mobile-breakpoint) {
      grid-template-columns: 1fr;
      gap: 24px;
      text-align: center;
    }
  }

  .footer-section {
    .footer-title {
      font-size: 24px;
      font-weight: 700;
      color: $primary-color;
      margin-bottom: 12px;
    }

    .footer-subtitle {
      font-size: 16px;
      font-weight: 600;
      color: $primary-color;
      margin-bottom: 16px;
    }

    .footer-description {
      color: $text-secondary;
      font-size: 14px;
      line-height: 1.5;
    }
  }

  .footer-links {
    list-style: none;

    li {
      margin-bottom: 8px;
    }

    .footer-link {
      color: $text-secondary;
      text-decoration: none;
      font-size: 14px;
      transition: color $transition-speed ease;

      &:hover {
        color: $primary-color;
      }
    }
  }

  @media (hover: none) {
    .footer-links {
      .footer-link:hover {
        color: $text-secondary;
      }
    }
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24px;
    border-top: 1px solid $border-light;

    @media (max-width: $mobile-breakpoint) {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }

    .copyright {
      p {
        color: $text-secondary;
        font-size: 14px;
      }
    }

    .footer-policies {
      display: flex;
      align-items: center;
      gap: 12px;

      .policy-link {
        color: $text-secondary;
        text-decoration: none;
        font-size: 14px;
        transition: color $transition-speed ease;

        &:hover {
          color: $primary-color;
        }
      }

      .divider {
        color: $border-color;
        font-size: 12px;
      }
    }
  }
}
</style>
