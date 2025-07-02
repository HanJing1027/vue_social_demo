<template>
  <TheModal>
    <!-- 貼文內容 -->
    <div class="post-detail">
      <div class="post-layout">
        <!-- 左側圖片 -->
        <div class="post-image-section">
          <img :src="post.image" alt="貼文圖片" />
        </div>

        <!-- 右側內容 -->
        <div class="post-content-section">
          <!-- 貼文標題區域 (固定不滾動) -->
          <div class="post-header">
            <div class="user-info">
              <div class="avatar" @click="goToUserProfile(post.user?.id)">
                <TheAvatar :src="post.user?.avatar" :width="40" :height="40" :fontSize="20" />
              </div>
              <div>
                <div class="username" @click="goToUserProfile(post.user?.id)">
                  {{ post.user?.name || post.user?.username }}
                </div>
                <div class="post-time">{{ formatTimeAgo(post.createdAt) }}</div>
              </div>
            </div>
          </div>

          <!-- 可滾動的內容區域 -->
          <div class="post-scrollable-content">
            <!-- 貼文文字內容 -->
            <div class="post-content">
              <p class="post-text">
                {{ content }}
              </p>

              <!-- 標籤 -->
              <div class="post-tags">
                <span v-for="(tag, index) in post.tags" :key="index" class="tag">{{ tag }}</span>
              </div>
            </div>

            <!-- 互動按鈕 -->
            <PostActions :post="post" />

            <!-- 留言區域 -->
            <div class="comments-section">
              <h3 class="comments-title">留言</h3>

              <!-- 新增留言 -->
              <form class="comment-input" @submit.prevent="addComment">
                <textarea v-model="commentContent" type="text" placeholder="寫下你的留言..." />
                <button type="submit" class="send-btn">
                  <i class="bx bx-send"></i>
                </button>
              </form>

              <!-- 留言列表 -->
              <div v-if="comments.length > 0" class="comments-list">
                <div class="comment-item" v-for="comment in comments" :key="comment.id">
                  <div class="avatar" @click="goToUserProfile(comment.user?.id)">
                    <TheAvatar
                      :src="comment.user?.avatar"
                      :width="40"
                      :height="40"
                      :fontSize="20"
                    />
                  </div>
                  <div class="comment-content">
                    <div class="comment-header">
                      <span class="comment-username" @click="goToUserProfile(comment.user?.id)">{{
                        comment.user?.name || comment.user?.username
                      }}</span>
                      <span v-if="comment.user?.id === post.user?.id" class="original-poster-tag"
                        >原po</span
                      >
                      <span class="comment-time">{{ formatTimeAgo(comment.pubDate) }}</span>
                    </div>
                    <p class="comment-text">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
              <!-- 如果沒有留言，顯示提示 -->
              <div v-else class="no-comments">
                <p>還沒有留言，快來搶沙發！</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TheModal>
</template>

<script setup>
import TheModal from '@/components/common/TheModal.vue'
import TheAvatar from '@/components/common/TheAvatar.vue'
import PostActions from '@/components/post/PostActions.vue'

import { ref, computed, onMounted } from 'vue'
import { usePostStore } from '@/stores/modules/postStore'
import { useCommentStore } from '@/stores/modules/commentStore'
import { useToastStore } from '@/stores/modules/toastStore'
import { useModalStore } from '@/stores/modules/modalStore'
import { formatTimeAgo } from '@/utils/postUtils'
import { useRouter } from 'vue-router'
import { debounce } from '@/utils/debounce'

const postStore = usePostStore()
const commentStore = useCommentStore()
const toastStore = useToastStore()
const modalStore = useModalStore()
const router = useRouter()
const commentContent = ref('')

const post = computed(() => postStore.postDetails || {})
const comments = computed(() => commentStore.list)

const description = post.value.description || ''
const content = description.replace(/#[\u4e00-\u9fa5\w]+/g, '').trim()

const goToUserProfile = (userId) => {
  if (!post.value?.user || !post.value?.user?.id) {
    toastStore.showError('用戶資訊不完整，無法跳轉到個人主頁')
    return
  }

  router.push(`/profile/${userId}`)

  modalStore.closeAllModals() // 關閉所有彈跳視窗
}

// 新增留言
const originalAddComment = async () => {
  if (!commentContent.value.trim()) {
    toastStore.showError('留言內容不能為空')
    return
  }

  try {
    await commentStore.addComment(commentContent.value.trim(), post.value.id)

    postStore.increaseCommentCount(post.value.id) // 更新貼文的留言數量

    toastStore.showSuccess('留言新增成功')
  } catch (error) {
    toastStore.showError('新增留言失敗，請稍後再試')
  } finally {
    commentContent.value = '' // 清空留言輸入框
  }
}

const addComment = debounce(originalAddComment, 300)

onMounted(() => {
  commentStore.loadComments(postStore.currentPostId)
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;
@use '@/assets/styles/_mixins.scss' as *;

.post-detail {
  height: 100%;
  min-height: 0;

  .post-layout {
    display: flex;
    height: 100%;
    min-height: 0;
  }

  .post-image-section {
    flex: 1.5;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $surface-alt;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      object-position: center;
    }
  }

  .post-content-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .post-header {
    padding: 20px;
    border-bottom: 1px solid $border-light;
    flex-shrink: 0;
  }

  .post-scrollable-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;

    /* 添加滾動條樣式 */
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: $border-light;
      border-radius: 4px;

      &:hover {
        background: $text-secondary;
      }
    }

    scrollbar-width: thin;
    scrollbar-color: $border-light transparent;
  }

  .post-content {
    padding: 20px;
    border-bottom: 1px solid $border-light;
    flex-shrink: 0;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .avatar {
      cursor: pointer;
    }
  }

  .username {
    cursor: pointer;
    font-weight: 600;
    color: $text-color;
    font-size: 16px;
    margin-bottom: 5px;
  }

  .post-time {
    color: $text-secondary;
    font-size: 14px;
  }

  .post-text {
    color: $text-color;
    line-height: 1.6;
    font-size: 16px;
    margin: 0 0 16px 0;
    white-space: pre-line;
  }

  .post-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .tag {
    background-color: rgba(var(--primary-color-rgb), 0.1);
    color: $primary-color;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color $transition-speed ease;

    &:hover {
      background-color: rgba(var(--primary-color-rgb), 0.2);
    }
  }
}

.comments-section {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  .comments-title {
    font-size: 18px;
    font-weight: 600;
    color: $text-color;
    margin-bottom: 16px;
    flex-shrink: 0;
  }

  .comment-input {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    border-radius: 12px;
    flex-shrink: 0;

    textarea {
      @include base-input($borderRadius: 20px);
      min-height: 40px;
      max-height: 120px;
      height: 40px;
      resize: none;
      padding: 12px 16px;
      line-height: 1.4;
      font-size: 14px;
      overflow-y: auto;

      // 自動擴展高度
      &:focus {
        height: auto;
        min-height: 60px;
      }
    }

    .send-btn {
      width: 28px;
      height: 28px;
      border: none;
      background: $primary-color;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all $transition-speed ease;

      &:hover {
        transform: scale(1.1);
      }

      i {
        font-size: 14px;
        color: white;
      }
    }
  }

  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
    min-height: 0;
  }

  .comment-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 12px;

    .avatar {
      cursor: pointer;
    }
  }

  .comment-content {
    flex: 1;
    background: #f8f9fa;
    padding: 8px 12px;
    border-radius: 12px 12px 12px 3px;
    position: relative;
    max-width: 85%;

    &::before {
      content: '';
      position: absolute;
      left: -5px;
      top: 8px;
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-right-color: #f8f9fa;
    }
  }

  .comment-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 2px;
  }

  .comment-username {
    cursor: pointer;
    font-weight: 600;
    color: $primary-color;
    font-size: 13px;
  }

  .original-poster-tag {
    background-color: $primary-color;
    color: $background;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 8px;
  }

  .comment-time {
    color: $text-secondary;
    font-size: 11px;
  }

  .comment-text {
    color: $text-color;
    font-size: 13px;
    line-height: 1.4;
    margin: 0;
    white-space: pre-line;
  }
}

@media (max-width: $mobile-breakpoint) {
  .post-detail {
    .post-layout {
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }

    .post-image-section {
      flex: none;
      height: 35vh;
      background: #f5f5f5; /* 手機版也改為灰色背景 */

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain; /* 手機版也改為 contain */
        object-position: center;
      }
    }

    .post-content-section {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .post-scrollable-content {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: $border-light;
        border-radius: 3px;

        &:hover {
          background: $text-secondary;
        }
      }
    }

    .post-header {
      padding: 12px 16px;
    }

    .post-content {
      padding: 12px 16px;
    }

    .user-info {
      gap: 8px;
    }

    .username {
      font-size: 14px;
      margin-bottom: 2px;
    }

    .post-time {
      font-size: 12px;
    }

    .post-text {
      font-size: 14px;
      line-height: 1.4;
      margin: 0 0 8px 0;
    }

    .post-tags {
      gap: 6px;
    }

    .tag {
      padding: 3px 8px;
      font-size: 12px;
    }
  }

  .comments-section {
    padding: 12px 16px;
    flex: 1;
    min-height: 0;

    .comments-title {
      font-size: 16px;
      margin-bottom: 10px;
    }

    .comment-input {
      margin-bottom: 12px;

      input {
        font-size: 14px;
        padding: 8px 16px;
      }

      .send-btn {
        width: 24px;
        height: 24px;

        i {
          font-size: 11px;
        }
      }
    }

    .comments-list {
      gap: 8px;
    }

    .comment-item {
      gap: 8px;
      margin-bottom: 8px;
    }

    .comment-content {
      padding: 6px 10px;
      border-radius: 10px 10px 10px 2px;

      &::before {
        left: -4px;
        top: 6px;
        border-width: 4px;
        border-right-color: #f8f9fa;
      }
    }

    .comment-header {
      gap: 4px;
      margin-bottom: 1px;
    }

    .comment-username {
      font-size: 12px;
    }

    .comment-time {
      font-size: 10px;
    }

    .comment-text {
      font-size: 12px;
      line-height: 1.3;
    }
  }
}

.no-comments {
  text-align: center;
  padding: 40px 20px;
  color: $text-secondary;

  p {
    margin: 0;
    font-size: 14px;
  }
}

@media (max-width: 768px) and (min-width: $mobile-breakpoint) {
  .post-detail {
    .post-layout {
      flex-direction: column;
    }

    .post-image-section {
      height: 40vh;
      background: #f5f5f5; /* 平板版也改為灰色背景 */

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        object-position: center;
      }
    }

    .post-content_section {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  .comments-section {
    padding: 16px;

    .comments-list {
      gap: 12px;
    }
  }
}
</style>
