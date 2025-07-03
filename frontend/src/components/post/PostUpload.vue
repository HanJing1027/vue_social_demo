<template>
  <TheModal>
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
            <TheAvatar :src="userStore.user.avatar" :width="40" :height="40" :fontSize="20" />
          </div>
          <div class="user-name">{{ userData.username }}</div>
        </div>

        <!-- 貼文內容輸入 -->
        <div class="post-input-section">
          <textarea
            v-model="postContent"
            class="post-textarea"
            placeholder="分享你的想法..."
            rows="4"
          ></textarea>
        </div>

        <!-- 圖片上傳區域 -->
        <div class="image-upload-section">
          <div
            class="upload-area"
            :class="{ 'has-image': uploadedImage }"
            @click.stop="triggerFileInput"
          >
            <!-- 未上傳圖片時顯示上傳提示 -->
            <template v-if="!uploadedImage">
              <i class="bx bx-image-add"></i>
              <span class="upload-text">點擊上傳圖片</span>
            </template>
            <!-- 上傳圖片後顯示預覽 -->
            <template v-else>
              <img :src="uploadedImage.url" alt="預覽圖片" class="preview-image" />
              <button class="remove-image-btn" @click.stop="removeImage">
                <i class="bx bx-x"></i>
              </button>
            </template>
          </div>
          <input
            ref="fileInputRef"
            type="file"
            class="file-input"
            accept="image/*"
            @change="handleFileUpload"
          />
        </div>

        <!-- 標籤輸入區域 -->
        <div class="tags-section">
          <div class="tag-input-wrapper">
            <i class="bx bx-hash"></i>
            <input
              v-model="newTag"
              type="text"
              class="tag-input"
              placeholder="新增標籤 (按 Enter 確認)"
              @keydown="inputHandler.handleKeyDown"
              @compositionstart="inputHandler.handleCompositionStart"
              @compositionend="inputHandler.handleCompositionEnd"
            />
            <button class="add-tag-btn" @click="addTag" :disabled="!newTag.trim()">
              <i class="bx bx-plus"></i>
            </button>
          </div>
          <div class="tags-display" v-if="postTags.length > 0">
            <span v-for="(tag, index) in postTags" :key="index" class="tag"
              >#{{ tag }} <i @click="removeTag(index)" class="bx bx-x"></i
            ></span>
          </div>
        </div>
      </div>

      <!-- 底部按鈕 -->
      <div class="upload-footer">
        <TheButton :bxIcon="`bx-x`" :reverse="true" @click="handleClose">取消</TheButton>
        <TheButton :bxIcon="`bx-send`" @click="publishPost">發布貼文</TheButton>
      </div>
    </div>
  </TheModal>
</template>

<script setup>
import TheModal from '@/components/common/TheModal.vue'
import TheAvatar from '@/components/common/TheAvatar.vue'
import TheButton from '@/components/common/TheButton.vue'

import { ref, computed } from 'vue'
import { usePostStore } from '@/stores/modules/postStore'
import { useUserStore } from '@/stores/modules/userStore'
import { useModalStore } from '@/stores/modules/modalStore'
import { useToastStore } from '@/stores/modules/toastStore'
import { useRoute } from 'vue-router'
import { debounce } from '@/utils/debounce'
import { createInputMethodHandler } from '@/utils/createInputMethodHandler'

const userStore = useUserStore()
const modalStore = useModalStore()
const toastStore = useToastStore()
const postStore = usePostStore()
const route = useRoute()

// 用於存儲貼文內容
const postContent = ref('')
const newTag = ref('')
const postTags = ref([])

// 用於儲存上傳的圖片
const uploadedImage = ref(null)
const fileInputRef = ref(null)

// 獲取用戶資料
const userData = computed(() => {
  return userStore.user
})

// 驗證貼文表單是否符合要求
const isFormValid = computed(() => {
  return postContent.value.trim() !== '' && uploadedImage.value !== null
})

// 格式化 description，將內容和標籤合併
const formatDescription = () => {
  let description = postContent.value.trim()

  if (postTags.value.length > 0) {
    // 將標籤中的空格替換為 "_"
    const tagsString = postTags.value
      .map((tag) => `#${tag.replace(/\s+/g, '_')}`) // 替換空格為 "_"
      .join(' ')
    description = description ? `${description}\n\n${tagsString}` : tagsString
  }

  return description
}

// 發布貼文
const originalPublishPost = async () => {
  if (!isFormValid.value) {
    toastStore.showError('請至少輸入內容與上傳圖片')
    return
  }

  try {
    const description = formatDescription()
    const imageFile = uploadedImage.value.file

    await postStore.createPost(imageFile, description, route.params.userId || '')

    // 清空表單
    postContent.value = ''
    newTag.value = ''
    postTags.value = []
    uploadedImage.value = null
    fileInputRef.value.value = null

    handleClose()

    toastStore.showSuccess('貼文發佈成功！')
  } catch (error) {
    toastStore.showError('發布貼文失敗，請稍後再試')
    console.error(`發布貼文失敗: ${error}`)
  }
}
const publishPost = debounce(originalPublishPost, 300)

// 觸發文件選擇
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// 處理文件上傳
const handleFileUpload = (event) => {
  const file = event.target.files[0]

  if (!file) return

  // 檢查圖片大小
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    toastStore.showError('圖片大小不能超過 5MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedImage.value = {
      file: file,
      url: e.target.result,
      name: file.name,
      size: file.size,
    }
  }
  reader.onerror = () => {
    toastStore.showError('圖片讀取失敗')
  }
  reader.readAsDataURL(file)
}

// 移除圖片
const removeImage = () => {
  uploadedImage.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// 添加標籤
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !postTags.value.includes(tag)) {
    postTags.value.push(tag)
    newTag.value = ''
  } else if (postTags.value.includes(tag)) {
    toastStore.showError('標籤已存在')
  } else {
    toastStore.showError('請輸入有效的標籤')
  }
}

// 使用輸入法處理工具
const inputHandler = createInputMethodHandler(addTag)

// 移除標籤
const removeTag = (index) => {
  postTags.value.splice(index, 1)
}

// 關閉模態框
const handleClose = () => {
  modalStore.closeModal('postUpload')
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
    text-align: center;
    background: $surface-alt;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;

    // 未上傳狀態
    &:not(.has-image) {
      padding: 40px 20px;
      min-height: 120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      &:hover {
        border-color: $primary-color;
        background: $surface-hover;
      }

      i {
        font-size: 36px;
        color: $text-secondary;
        margin-bottom: 8px;
      }

      .upload-text {
        color: $text-secondary;
        font-size: 14px;
      }
    }

    // 有圖片狀態
    &.has-image {
      padding: 0;
      height: auto;
      border-style: solid;
      border-color: $primary-color;

      &:hover {
        .preview-image {
          transform: scale(1.02);
        }
      }
    }

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.2s ease;
    }

    .remove-image-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 28px;
      height: 28px;
      border: none;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: 2;

      &:hover {
        background: rgba(0, 0, 0, 0.8);
        transform: scale(1.1);
      }

      i {
        font-size: 14px;
        color: white;
        margin: 0;
      }
    }
  }
  .file-input {
    display: none; // 隱藏實際的文件輸入
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

    .add-tag-btn {
      background: $primary-color;
      border: none;
      border-radius: 8px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;

      &:hover:not(:disabled) {
        opacity: 0.9;
        transform: scale(1.05);
      }

      &:disabled {
        background: $border-color;
        cursor: not-allowed;
        opacity: 0.5;
      }

      i {
        font-size: 16px;
        color: white;
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
