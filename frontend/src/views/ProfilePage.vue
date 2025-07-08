<template>
  <div class="profile-page">
    <!-- 個人資料區域 -->
    <div class="profile-header">
      <div class="profile-info">
        <div class="profile-main">
          <div class="avatar-section">
            <TheAvatar :src="userData.avatar" :width="100" :height="100" :fontSize="60" />
          </div>

          <div class="user-content">
            <div class="user-info">
              <h1 class="username">{{ userData.username }}</h1>
              <h4 v-if="!userData.name" class="userid">@{{ userData.username?.toLowerCase() }}</h4>
              <h4 v-else class="userid">@{{ userData.name }}</h4>
            </div>
            <router-link v-if="isSelf" to="/profile/edit" class="edit-profile-btn">
              編輯個人資料
            </router-link>
          </div>
        </div>

        <div class="bio">
          <p v-if="userData.intro" class="bio-text">
            {{ userData.intro }}
          </p>
          <p v-else class="bio-text no-bio">用戶還沒有填寫個人簡介。</p>
          <div v-if="userData.website" class="bio-weblink">
            <i class="bx bx-link"></i>
            <a :href="userData.website" target="_blank">
              {{ userData.website }}
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
          <span class="posts-count">{{ currentPostList.length || '0' }} 篇貼文</span>
        </div>
      </div>

      <!-- 篩選標籤 -->
      <div class="filter-tabs">
        <div
          class="active-indicator"
          :style="{
            width: `calc(100% / ${isSelf ? 3 : 2})`,
            transform: `translateX(${activeIndex * 100}%)`,
          }"
        ></div>
        <button
          class="filter-tab"
          :class="{ active: activeIndex === 0 }"
          :disabled="activeIndex === 0"
          @click="activeIndex !== 0 && setActiveTab(0)"
        >
          <i class="bx bx-grid-alt"></i>
          {{ isSelf ? '我的' : '用戶的' }}
        </button>

        <button
          class="filter-tab"
          :class="{ active: activeIndex === 1 }"
          :disabled="activeIndex === 1"
          @click="activeIndex !== 1 && setActiveTab(1)"
        >
          <i class="bx bx-heart"></i>
          讚過
        </button>

        <button
          v-if="isSelf"
          :class="{ active: activeIndex === 2 }"
          class="filter-tab"
          :disabled="activeIndex === 2"
          @click="activeIndex !== 2 && setActiveTab(2)"
        >
          <i class="bx bx-bookmark"></i>
          收藏
        </button>
      </div>

      <!-- 網格視圖 -->
      <p v-if="currentPostList.length === 0" class="no-posts-message">尚未有貼文</p>

      <div v-else class="posts-grid">
        <div
          class="grid-item"
          v-for="post in activeIndex === 0
            ? postStore.userPostList
            : activeIndex === 1
              ? postStore.likedPostList
              : activeIndex === 2
                ? postStore.favoredPostList
                : []"
          :key="post.id"
        >
          <!-- 貼文圖片區域 -->
          <div class="grid-item-content" @click="handlePostClick(post.id)">
            <img
              v-for="postImg in post.image"
              :src="postImg.attributes.url"
              :key="postImg.id"
              alt="貼文圖片"
            />
          </div>

          <!-- 三點式選單 -->
          <TheDropdown v-if="isPostOwner(post) && isSelf" class="grid-item-dropdown" @click.stop>
            <template #menu="{ close }">
              <TheDropdownItem icon="bx bx-edit" @click="startEditPost(post.id, close)">
                編輯貼文
              </TheDropdownItem>
              <TheDropdownItem
                icon="bx bx-trash"
                variant="danger"
                @click="deletePost(post.id, close)"
              >
                刪除貼文
              </TheDropdownItem>
            </template>
          </TheDropdown>

          <!-- 貼文統計區域 -->
          <div class="grid-item-stats">
            <span class="stat">
              <i class="bx bx-heart"></i>
              {{ post.liked_bies }}
            </span>
            <span class="stat">
              <i class="bx bx-comment"></i>
              {{ post.comments }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TheAvatar from '@/components/common/TheAvatar.vue'
import TheDropdown from '@/components/common/TheDropdown.vue'
import TheDropdownItem from '@/components/common/TheDropdownItem.vue'

import { ref, computed, watch, onMounted } from 'vue'
import { useUserStore } from '@/stores/modules/userStore'
import { usePostStore } from '@/stores/modules/postStore'
import { useModalStore } from '@/stores/modules/modalStore'
import { useToastStore } from '@/stores/modules/toastStore'
import { useConfirmStore } from '@/stores/modules/confirmStore'
import { useRoute } from 'vue-router'
import { getUserApi } from '@/apis/getUserApi'

const userStore = useUserStore()
const postStore = usePostStore()
const modalStore = useModalStore()
const toastStore = useToastStore()
const confirmStore = useConfirmStore()
const route = useRoute()

const userData = ref({})
const activeIndex = ref(0)

// 判斷是否為自己的頁面
const isSelf = computed(() => {
  return String(userStore?.user?.id) === String(route?.params?.userId)
})

// 判斷是否為貼文擁有者
const isPostOwner = (post) => {
  return userStore.user?.id === post.user?.id
}

// 根據 activeIndex 動態選擇對應的貼文列表
const currentPostList = computed(() => {
  if (activeIndex.value === 0) {
    return postStore.userPostList || []
  } else if (activeIndex.value === 1) {
    return postStore.likedPostList || []
  } else if (activeIndex.value === 2) {
    return postStore.favoredPostList || []
  }
  return []
})

// 加載用戶資料
const loadUserData = async () => {
  const response = await getUserApi.getUserById(route.params.userId)
  userData.value = response
}

// 標籤切換
const setActiveTab = (index) => {
  activeIndex.value = index
  if (index === 0) {
    postStore.loadPostsByUser(route.params.userId)
  } else if (index === 1) {
    postStore.loadPostsLikedOrFavoredByUser(route.params.userId, 'likes')
  } else if (index === 2) {
    postStore.loadPostsLikedOrFavoredByUser(route.params.userId, 'favors')
  }
}

const handlePostClick = (id) => {
  postStore.setCurrentPostId(id)
  modalStore.openModal('postDetails')
}

// 開始編輯貼文
const startEditPost = (postId, closeDropdown) => {
  closeDropdown()
  postStore.setCurrentPostId(postId)
  modalStore.openModal('postDetails')
  modalStore.setEditMode(true)
}

// 刪除貼文
const deletePost = async (postId, closeDropdown) => {
  closeDropdown()

  confirmStore.showConfirm({
    title: '確認刪除貼文',
    message: '您確定要刪除此貼文嗎？此操作無法恢復。',
    onConfirm: async () => {
      try {
        await postStore.deletePost(postId)
        toastStore.showSuccess('貼文已成功刪除')
        // 重新加載當前標籤的貼文列表
        setActiveTab(activeIndex.value)
      } catch (error) {
        toastStore.showError('刪除貼文失敗，請稍後再試')
      }
    },
  })
}

watch(
  () => route.params.userId,
  (newUserId) => {
    loadUserData()
    postStore.loadPostsByUser(newUserId)
  }
)

onMounted(() => {
  loadUserData()
  postStore.loadAllPosts()
  postStore.loadPostsByUser(route.params.userId)
})
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
    font-size: 15px;
    font-weight: 500;
    margin: 0;
    white-space: pre-wrap;
  }

  .no-bio {
    color: $text-secondary;
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
  position: relative;
  display: flex;
  gap: 2px;
  margin-bottom: 24px;
  background: $background;
  border-radius: 12px;
  padding: 4px;
  border: 1px solid $border-light;
  overflow: hidden;

  .active-indicator {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: $surface-hover;
    border-radius: 8px;
    transition: transform $transition-speed ease;
    z-index: 0;
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
    transition: color 0.3s ease;
    position: relative;
    z-index: 1;

    &:hover {
      color: $text-color;
    }

    &.active {
      color: $primary-color;
    }

    i {
      font-size: 16px;
    }
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
  border: 1px solid $border-light;
  transition: transform $transition-speed ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: $shadow-light;
  }

  .grid-item-content {
    width: 100%;
    height: 100%;
    cursor: pointer;
    position: relative;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .grid-item-dropdown {
    position: absolute;
    top: 8px;
    right: 8px;
    transition: opacity $transition-speed ease;
    z-index: 10;

    :deep(.dropdown-trigger) {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 255, 255, 0.1);

      &:hover {
        background: rgba(0, 0, 0, 0.7);
      }

      i {
        color: white;
      }
    }
  }

  .grid-item-stats {
    position: absolute;
    bottom: 8px;
    left: 8px;
    display: flex;
    gap: 12px;
    background: rgba(0, 0, 0, 0.6);
    padding: 4px 8px;
    border-radius: 8px;
    color: white;
    font-size: 14px;

    .stat {
      display: flex;
      align-items: center;
      gap: 4px;

      i {
        font-size: 16px;
      }
    }
  }
}

.no-posts-message {
  text-align: center;
  color: $text-secondary;
  font-size: 16px;
  font-weight: 600;
}

@media (hover: none) {
  .grid-item:hover {
    transform: none;
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
    gap: 16px;
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

  .grid-item {
    .grid-item-dropdown {
      opacity: 1; // 手機版本始終顯示
    }
  }
}

@media (max-width: $small-phone-breakpoint) {
  .profile-page {
    padding: 0 8px;
  }

  .profile-main {
    gap: 12px;
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
