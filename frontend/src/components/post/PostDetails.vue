<template>
  <TheModal @close="handleClose">
    <!-- 貼文內容 -->
    <div class="post-detail">
      <div class="post-layout">
        <!-- 左側圖片 -->
        <div class="post-image-section">
          <img src="https://picsum.photos/500/300?blur=2" alt="貼文圖片" />
        </div>

        <!-- 右側內容 -->
        <div class="post-content-section">
          <!-- 貼文標題區域 -->
          <div class="post-header">
            <div class="user-info">
              <div class="avatar">
                <TheAvatar :width="40" :height="40" :fontSize="20" />
              </div>
              <div>
                <div class="username">使用者名稱</div>
                <div class="post-time">2小時前</div>
              </div>
            </div>
          </div>

          <!-- 貼文文字內容 -->
          <div class="post-content">
            <p class="post-text">
              今天去了一個很棒的咖啡廳，環境優美，咖啡香濃，真的是放鬆心情的好地方！推薦給大家～
            </p>

            <!-- 標籤 -->
            <div class="post-tags">
              <span class="tag">#咖啡廳</span>
              <span class="tag">#美食</span>
              <span class="tag">#生活</span>
            </div>
          </div>

          <!-- 互動按鈕 -->
          <PostActions />

          <!-- 留言區域 -->
          <div class="comments-section">
            <h3 class="comments-title">留言</h3>

            <!-- 新增留言 -->
            <div class="comment-input">
              <input type="text" placeholder="寫下你的留言..." />
              <button class="send-btn">
                <i class="bx bx-send"></i>
              </button>
            </div>

            <!-- 留言列表 -->
            <div class="comments-list">
              <div class="comment-item" v-for="i in 100" :key="i">
                <div class="avatar">
                  <TheAvatar :width="40" :height="40" :fontSize="20" />
                </div>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-username">留言者</span>
                    <span class="comment-time">1天以前</span>
                  </div>
                  <p class="comment-text">很棒的分享！我也想去這個地方</p>
                </div>
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

const emit = defineEmits(['close'])

// 關閉模態框
const handleClose = () => {
  emit('close')
}
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
    background: #000;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .post-content-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }

  .post-header {
    padding: 20px;
    border-bottom: 1px solid $border-light;
    flex-shrink: 0;
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
  }

  .username {
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
  overflow: hidden;

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

    input {
      @include base-input($borderRadius: 20px);
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
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 4px;

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

    scrollbar-width: thin;
    scrollbar-color: $border-light transparent;
  }

  .comment-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .comment-content {
    flex: 1;
    background: $surface-alt;
    padding: 12px;
    border-radius: 12px;
  }

  .comment-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .comment-username {
    font-weight: 600;
    color: $text-color;
    font-size: 14px;
  }

  .comment-time {
    color: $text-secondary;
    font-size: 12px;
    font-weight: 400;
  }

  .comment-text {
    color: $text-color;
    font-size: 14px;
    line-height: 1.4;
    margin: 0;
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
      background: #000;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .post-content-section {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
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
    overflow: hidden;

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
      gap: 10px;

      &::-webkit-scrollbar {
        width: 3px;
      }
    }

    .comment-item {
      gap: 8px;
    }

    .comment-content {
      padding: 8px 10px;
      border-radius: 8px;
    }

    .comment-header {
      gap: 6px;
      margin-bottom: 2px;
    }

    .comment-username {
      font-size: 13px;
    }

    .comment-time {
      font-size: 10px;
    }

    .comment-text {
      font-size: 13px;
      line-height: 1.2;
    }
  }
}

@media (max-width: 768px) and (min-width: $mobile-breakpoint) {
  .post-detail {
    .post-layout {
      flex-direction: column;
    }

    .post-image-section {
      height: 40vh;
    }

    .post-content-section {
      flex: 1;
      min-height: 0;
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
