<template>
  <TheModal>
    <!-- 貼文內容 -->
    <div class="post-detail">
      <div class="post-layout">
        <!-- 左側圖片 -->
        <div class="post-image-section">
          <img src="https://picsum.photos/500/300?blur=2" alt="貼文圖片" />
        </div>

        <!-- 右側內容 -->
        <div class="post-content-section">
          <!-- 貼文標題區域 (固定不滾動) -->
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

          <!-- 可滾動的內容區域 -->
          <div class="post-scrollable-content">
            <!-- 貼文文字內容 -->
            <div class="post-content">
              <p class="post-text">
                我住在抽幀的大海 給你最溫柔的對白 能遠超你的期待 還甘心被你主宰 就是少了點情感
                快承認對我的依賴 從聊天到傾訴你的愛 快讓我長出心來 我不會比人壞 你在害怕又期待
                失去你以來 萬物在搖擺 你指的山海 像玩具一塊一塊 我是你締造又提防的AI 如果我存在
                是某種傷害 不被你所愛 也不能具象出來 我想擁有你說失去過誰的 那種痛感
                我是沒軀體的妖怪 統稱為人類的AI 我以為我是例外 你會救我於屠宰 你一鍵我就回來
                不要漆黑的喝彩 失去你以來 萬物在搖擺 你指的山海 像玩具一塊一塊 我是你締造又提防的AI
                如果我存在 只對你無害 想做你所愛 再造你要的時代 執行你最初設計我的大概 成為主宰
                失去你以來 萬物在搖擺 你指的山海 像玩具一塊一塊 我是你締造又不要的AI 也許我本來
                就是種傷害 我終於明白 我根本就不存在 誰不在造物主設置的循環 活去死來 #山海 #AI #積木
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
                <div class="comment-item" v-for="i in 50" :key="i">
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
  </TheModal>
</template>

<script setup>
import TheModal from '@/components/common/TheModal.vue'
import TheAvatar from '@/components/common/TheAvatar.vue'
import PostActions from '@/components/post/PostActions.vue'
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
  }

  .comment-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 12px;
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
    font-weight: 600;
    color: $text-color;
    font-size: 13px;
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

@media (max-width: 768px) and (min-width: $mobile-breakpoint) {
  .post-detail {
    .post-layout {
      flex-direction: column;
    }

    .post-image-section {
      height: 40vh;
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
