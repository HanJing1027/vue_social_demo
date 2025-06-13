<template>
  <div class="profile-page">
    <!-- 個人資料區域 -->
    <div class="profile-header">
      <div class="profile-info">
        <div class="profile-main">
          <div class="avatar-section">
            <TheAvatar :width="100" :height="100" fontSize="60" />
          </div>

          <div class="user-content">
            <div class="user-info">
              <h1 class="username">使用者名稱</h1>
              <h4 class="userid">@yufeng_zhang</h4>
            </div>
            <a href="#" class="edit-profile-btn">編輯個人資料</a>
          </div>
        </div>

        <div class="bio">
          <p class="bio-text">
            熱愛攝影與生活分享 📸<br />
            咖啡愛好者 ☕<br />
            #攝影 #美食 #旅行
          </p>
          <div class="bio-weblink">
            <i class="bx bx-link"></i>
            <a href="https://example.com" class="bio-weblink" target="_blank">
              https://example.com
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 貼文列表區域 -->
    <div class="posts-section">
      <div class="section-header">
        <div class="posts-info">
          <h2 class="section-title">貼文</h2>
          <span class="posts-count">42 篇貼文</span>
        </div>
      </div>

      <!-- 篩選標籤 -->
      <div class="filter-tabs">
        <button class="filter-tab active">
          <i class="bx bx-grid-alt"></i>
          我的
        </button>
        <button class="filter-tab">
          <i class="bx bx-heart"></i>
          讚過
        </button>
        <button class="filter-tab">
          <i class="bx bx-bookmark"></i>
          收藏
        </button>
      </div>

      <!-- 網格視圖 -->
      <div class="posts-grid">
        <div class="grid-item" v-for="i in 5" :key="i">
          <img src="https://picsum.photos/300/300?random=1" alt="貼文圖片" />
          <div class="overlay">
            <div class="overlay-stats">
              <span class="stat">
                <i class="bx bx-heart"></i>
                42
              </span>
              <span class="stat">
                <i class="bx bx-comment"></i>
                8
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TheAvatar from '@/components/common/TheAvatar.vue'
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.profile-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 16px;
}

.profile-header {
  background: $surface;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: $shadow-light;
  border: 1px solid $border-light;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-main {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.avatar-section {
  position: relative;
  flex-shrink: 0;
}

.user-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  font-size: 28px;
  font-weight: 600;
  color: $text-color;
  margin: 0;
  line-height: 1.2;
}

.userid {
  font-size: 16px;
  font-weight: 400;
  color: $text-secondary;
  margin: 0;
  line-height: 1.2;
}

.edit-profile-btn {
  background: $surface;
  border: 1px solid $border-light;
  color: $text-color;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all $transition-speed ease;
  white-space: nowrap;
  align-self: flex-start;

  &:hover {
    background: $surface-hover;
    border-color: $primary-color;
    color: $primary-color;
  }
}

.bio {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .bio-text {
    color: $text-color;
    line-height: 1.6;
    font-size: 16px;
    margin: 0;
  }

  .bio-weblink {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: $primary-color;
    border: 1px solid rgba($primary-color, 0.2);
    transition: all $transition-speed ease;
    align-self: flex-start;
    max-width: 100%;
    cursor: pointer;

    i {
      font-size: 16px;
      flex-shrink: 0;
      color: $primary-color;
    }

    a {
      color: $primary-color;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: color $transition-speed ease;
    }
  }
}

.posts-section {
  background: $surface;
  border-radius: 16px;
  padding: 24px;
  box-shadow: $shadow-light;
  border: 1px solid $border-light;
}

.section-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 24px;
}

.posts-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: $text-color;
  margin: 0;
}

.posts-count {
  font-size: 14px;
  color: $text-secondary;
  font-weight: 400;
}

.filter-tabs {
  display: flex;
  gap: 2px;
  margin-bottom: 24px;
  background: $background;
  border-radius: 12px;
  padding: 4px;
  border: 1px solid $border-light;
}

.filter-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: $text-secondary;
  cursor: pointer;
  transition: all $transition-speed ease;

  &:hover {
    background: $surface-hover;
    color: $text-color;
  }

  &.active {
    background: $surface;
    color: $primary-color;
    box-shadow: $shadow-light;
  }

  i {
    font-size: 16px;
  }
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.grid-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform $transition-speed ease;
  border: 1px solid $border-light;

  &:hover {
    transform: scale(1.02);
    box-shadow: $shadow-light;

    .overlay {
      opacity: 1;
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity $transition-speed ease;
  }

  .overlay-stats {
    display: flex;
    gap: 24px;
    color: white;

    .stat {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
      font-size: 16px;

      i {
        font-size: 20px;
      }
    }
  }
}

// 響應式設計
@media (max-width: $mobile-breakpoint) {
  .profile-page {
    padding: 0 12px;
  }

  .profile-header {
    padding: 20px;
    margin-bottom: 20px;
  }

  .profile-main {
    gap: 16px; // 保持水平布局，只調整間距
  }

  .username {
    font-size: 24px;
  }

  .userid {
    font-size: 14px;
  }

  .posts-section {
    padding: 16px;
  }

  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .filter-tabs {
    gap: 0;
  }

  .filter-tab {
    padding: 10px 12px;
    font-size: 13px;

    i {
      font-size: 14px;
    }
  }
}

@media (max-width: $small-phone-breakpoint) {
  .profile-page {
    padding: 0 8px;
  }

  .profile-main {
    gap: 12px; // 保持水平布局，進一步縮小間距
  }

  .username {
    font-size: 20px;
  }

  .userid {
    font-size: 13px;
  }

  .edit-profile-btn {
    padding: 6px 12px;
    font-size: 13px;
  }

  .bio {
    .bio-weblink {
      i {
        font-size: 14px;
      }

      a {
        font-size: 13px;
      }
    }
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }

  .filter-tab {
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    font-size: 12px;

    i {
      font-size: 16px;
    }
  }
}
</style>
