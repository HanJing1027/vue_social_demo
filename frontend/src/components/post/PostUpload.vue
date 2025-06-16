<template>
  <TheModal @close="handleClose">
    <div class="post-upload">
      <!-- 標題區域 -->
      <div class="upload-header">
        <h2 class="upload-title">建立新貼文</h2>
      </div>

      <!-- 內容區域 -->
      <div class="upload-content">
        <!-- 用戶資訊 -->
        <div class="user-info">
          <div class="avatar">
            <TheAvatar :width="40" :height="40" :fontSize="20" />
          </div>
          <div class="user-name">使用者名稱</div>
        </div>

        <!-- 貼文內容輸入 -->
        <div class="post-input-section">
          <textarea class="post-textarea" placeholder="分享你的想法..." rows="4"></textarea>
        </div>

        <!-- 圖片上傳區域 -->
        <div class="image-upload-section">
          <div class="upload-area">
            <i class="bx bx-image-add"></i>
            <span class="upload-text">點擊或拖曳來上傳圖片</span>
            <input type="file" class="file-input" accept="image/*" multiple />
          </div>
        </div>

        <!-- 預覽圖片區域 -->
        <div class="image-preview-section">
          <div class="preview-item">
            <img src="https://picsum.photos/200/150" alt="預覽圖片" />
            <button class="remove-image-btn">
              <i class="bx bx-x"></i>
            </button>
          </div>
        </div>

        <!-- 標籤輸入 -->
        <div class="tags-section">
          <div class="tag-input-wrapper">
            <i class="bx bx-hash"></i>
            <input type="text" class="tag-input" placeholder="新增標籤 (按 Enter 確認)" />
          </div>
          <div class="tags-display">
            <span class="tag">#範例標籤 <i class="bx bx-x"></i></span>
            <span class="tag">#生活 <i class="bx bx-x"></i></span>
          </div>
        </div>
      </div>

      <!-- 底部按鈕 -->
      <div class="upload-footer">
        <TheButton :bxIcon="`bx-x`" :reverse="true" @click="handleClose">取消</TheButton>
        <TheButton :bxIcon="`bx-send`">發布貼文</TheButton>
      </div>
    </div>
  </TheModal>
</template>

<script setup>
import TheModal from '@/components/common/TheModal.vue'
import TheAvatar from '@/components/common/TheAvatar.vue'
import TheButton from '@/components/common/TheButton.vue'

// 定義 emit
const emit = defineEmits(['close'])

// 關閉模態框
const handleClose = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;
@use '@/assets/styles/_mixins.scss' as *;

.post-upload {
  height: 100%;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.upload-header {
  padding: 30px 24px;
  border-bottom: 1px solid $border-light;
  flex-shrink: 0;

  .upload-title {
    font-size: 20px;
    font-weight: 600;
    color: $text-color;
    margin: 0;
    text-align: center;
  }
}

.upload-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;

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

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;

  .user-name {
    font-weight: 600;
    color: $text-color;
    font-size: 16px;
  }
}

.post-input-section {
  .post-textarea {
    @include base-input($borderRadius: 12px);
    min-height: 200px;
    font-size: 16px;
    line-height: 1.5;
  }
}

.image-upload-section {
  .upload-area {
    border: 2px dashed $border-color;
    border-radius: 12px;
    padding: 40px 20px;
    text-align: center;
    background: $surface-alt;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      border-color: $primary-color;
      background: $surface-hover;
    }

    i {
      font-size: 48px;
      color: $text-secondary;
      margin-bottom: 12px;
      display: block;
    }

    .upload-text {
      color: $text-secondary;
      font-size: 14px;
    }

    .file-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }
}

.image-preview-section {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  .preview-item {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-image-btn {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 24px;
      height: 24px;
      border: none;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(0, 0, 0, 0.9);
        transform: scale(1.1);
      }

      i {
        font-size: 14px;
        color: white;
      }
    }
  }
}

.tags-section {
  .tag-input-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border: 1px solid $border-color;
    border-radius: 12px;
    background: $surface-alt;
    margin-bottom: 12px;
    transition: all 0.2s ease;

    &:focus-within {
      border-color: $primary-color;
      background: $surface;
      box-shadow: 0 0 0 3px $shadow-focus;
    }

    i {
      font-size: 18px;
      color: $text-secondary;
    }

    .tag-input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font-size: 14px;
      color: $text-color;

      &::placeholder {
        color: $text-secondary;
      }
    }
  }

  .tags-display {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    .tag {
      background-color: rgba(var(--primary-color-rgb), 0.1);
      color: $primary-color;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba(var(--primary-color-rgb), 0.2);
      }

      i {
        font-size: 12px;
        cursor: pointer;

        &:hover {
          color: $danger-color;
        }
      }
    }
  }
}

.upload-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid $border-light;
  flex-shrink: 0;
}

@media (max-width: $mobile-breakpoint) {
  .post-upload {
    max-height: 95vh;
  }

  .upload-header {
    padding: 16px;

    .upload-title {
      font-size: 18px;
    }
  }

  .upload-content {
    padding: 16px;
    gap: 16px;
  }

  .post-input-section {
    .post-textarea {
      min-height: 100px;
      font-size: 14px;
    }
  }

  .image-upload-section {
    .upload-area {
      padding: 30px 16px;

      i {
        font-size: 36px;
      }

      .upload-text {
        font-size: 13px;
      }
    }
  }

  .image-preview-section {
    .preview-item {
      width: 100px;
      height: 100px;
    }
  }

  .post-options {
    gap: 12px;

    .option-item {
      padding: 6px 12px;
      font-size: 13px;

      i {
        font-size: 16px;
      }
    }
  }

  .upload-footer {
    padding: 16px;
    gap: 10px;

    button {
      padding: 8px 16px;
      font-size: 13px;
    }
  }
}
</style>
