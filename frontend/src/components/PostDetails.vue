<template>
  <Teleport to="body">
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <!-- 關閉按鈕 -->
        <button class="close-btn" @click="handleClose">
          <i class="bx bx-x"></i>
        </button>

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
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import TheAvatar from '@/components/TheAvatar.vue'
import PostActions from '@/components/PostActions.vue'
import { onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['close'])

// 關閉模態框
const handleClose = () => {
  emit('close')
}

// 點擊遮罩關閉
const handleOverlayClick = () => {
  emit('close')
}

// 監聽 ESC 鍵關閉
onMounted(() => {
  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      emit('close')
    }
  }
  document.addEventListener('keydown', handleEscape)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: $surface;
  border-radius: 16px;
  max-width: 1100px;
  height: 80vh;
  width: 100%;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 30px $shadow-light;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: none;
  background: $surface-alt;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all $transition-speed ease;
  z-index: 10;

  &:hover {
    background: $surface-hover;
    transform: scale(1.1);
  }

  i {
    font-size: 24px;
    color: $text-secondary;
  }
}

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

  .post-actions {
    padding: 12px 20px;
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

  .post-content {
    padding: 20px;
    border-bottom: 1px solid $border-light;
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

  .post-actions {
    padding: 12px 20px;
    border-bottom: 1px solid $border-light;
  }

  .action-icons {
    display: flex;
    gap: 24px;
  }

  .icon-item {
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all $transition-speed ease;
    display: flex;
    align-items: center;
    gap: 6px;
    position: relative;
    user-select: none;

    &:hover {
      background-color: $surface-hover;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0px) scale(0.95);
    }

    i {
      font-size: 23px;
      transition: all $transition-speed ease;
    }

    .action-count {
      font-size: 12px;
      font-weight: 500;
      color: $text-secondary;
      transition: color $transition-speed ease;
      min-width: 20px;
    }
  }

  .heart-action {
    i {
      color: $text-secondary;
    }

    &:hover {
      background-color: rgba(220, 53, 69, 0.1);

      i {
        color: $danger-color;
        transform: scale(1.1);
      }

      .action-count {
        color: $danger-color;
      }
    }

    &.active {
      i {
        color: $danger-color;
        animation: heartBeat 0.6s ease-in-out;
      }

      .action-count {
        color: $danger-color;
        font-weight: 600;
      }
    }
  }

  .comment-action {
    i {
      color: $text-secondary;
    }

    &:hover {
      background-color: rgba(var(--primary-color-rgb), 0.1);

      i {
        color: $primary-color;
        transform: scale(1.1);
      }

      .action-count {
        color: $primary-color;
      }
    }
  }

  .star-action {
    i {
      color: $text-secondary;
    }

    &:hover {
      background-color: rgba(243, 156, 18, 0.1);

      i {
        color: #f39c12;
        transform: scale(1.1);
      }

      .action-count {
        color: #f39c12;
      }
    }

    &.active {
      i {
        color: #f39c12;
        animation: heartBeat 0.6s ease-in-out;
      }

      .action-count {
        color: #f39c12;
        font-weight: 600;
      }
    }
  }
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
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
      width: 100%;
      padding: 10px 40px 10px 16px;
      border: 1px solid $border-color;
      border-radius: 20px;
      background: $surface-alt;
      font-size: 14px;
      outline: none;
      transition: all 0.2s ease;
      color: $text-color;

      &:focus {
        border-color: $primary-color;
        background: $surface;
        box-shadow: 0 0 0 3px $shadow-focus;
      }

      &::placeholder {
        color: $text-secondary;
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
  .modal-overlay {
    padding: 0;
  }

  .modal-content {
    max-width: 100%;
    height: 100vh;
    border-radius: 0;
    margin: 0;
  }

  .close-btn {
    position: fixed;
    top: 10px;
    right: 10px;
    width: 36px;
    height: 36px;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1001;

    i {
      font-size: 20px;
      color: white;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.9);
    }
  }

  .post-detail {
    height: 100%;
    min-height: 0;

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
      border-bottom: 1px solid $border-light;
      flex-shrink: 0;
    }

    .post-content {
      padding: 12px 16px;
      border-bottom: 1px solid $border-light;
      flex-shrink: 0;
    }

    .post-actions {
      padding: 8px 16px;
      border-bottom: 1px solid $border-light;
      flex-shrink: 0;
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

    .action-icons {
      gap: 12px;
    }

    .icon-item {
      padding: 4px 6px;

      i {
        font-size: 18px;
      }

      .action-count {
        font-size: 11px;
      }
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
      padding: 6px 10px;
      margin-bottom: 12px;
      border-radius: 10px;

      input {
        font-size: 14px;
        padding: 4px 0;
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
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 2px;

      &::-webkit-scrollbar {
        width: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: $border-light;
        border-radius: 2px;
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

// 平板尺寸調整
@media (max-width: 768px) and (min-width: $mobile-breakpoint + 1) {
  .modal-content {
    max-width: 90%;
    height: 85vh;
    border-radius: 12px;
  }

  .close-btn {
    top: 15px;
    right: 15px;
    width: 38px;
    height: 38px;

    i {
      font-size: 22px;
    }
  }

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
