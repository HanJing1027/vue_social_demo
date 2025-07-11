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
            maxlength="500"
            rows="4"
          ></textarea>
          <div class="char-count" :class="{ 'char-limit-warning': postContent.length > 450 }">
            {{ postContent.length }}/500
          </div>
        </div>

        <!-- 多圖片上傳區域 -->
        <div class="image-upload-section">
          <!-- 上傳按鈕 -->
          <div
            class="upload-area"
            @click.stop="triggerFileInput"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
            :class="{ dragging: isDragging }"
            v-if="uploadedImages.length < 10"
          >
            <i class="bx bx-image-add"></i>
            <span class="upload-text">點擊上傳圖片 (最多10張)</span>
            <span class="upload-count">已上傳 {{ uploadedImages.length }}/10</span>
          </div>

          <!-- 圖片預覽網格 -->
          <div
            class="images-preview-grid"
            ref="sortableContainer"
            v-show="uploadedImages.length > 0"
          >
            <div v-for="(image, index) in uploadedImages" :key="image.id" class="preview-item">
              <img :src="image.url" alt="預覽圖片" class="preview-image" />
              <button class="remove-image-btn" @click.stop="removeImage(index)">
                <i class="bx bx-x"></i>
              </button>
            </div>
          </div>

          <input
            ref="fileInputRef"
            type="file"
            class="file-input"
            accept="image/*"
            multiple
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
              @keydown.enter="inputHandler.handleKeyDown"
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

import { ref, computed, onMounted, nextTick } from 'vue'
import { usePostStore } from '@/stores/modules/postStore'
import { useUserStore } from '@/stores/modules/userStore'
import { useModalStore } from '@/stores/modules/modalStore'
import { useToastStore } from '@/stores/modules/toastStore'
import { useRoute } from 'vue-router'
import { debounce } from '@/utils/debounce'
import { createInputMethodHandler } from '@/utils/createInputMethodHandler'

import Sortable from 'sortablejs'

const userStore = useUserStore()
const modalStore = useModalStore()
const toastStore = useToastStore()
const postStore = usePostStore()
const route = useRoute()

// 用於存儲貼文內容
const postContent = ref('')
const newTag = ref('')
const postTags = ref([])

// 多圖片儲存
const uploadedImages = ref([])
const fileInputRef = ref(null)
const sortableContainer = ref(null)

// 獲取用戶資料
const userData = computed(() => {
  return userStore.user
})

// 驗證貼文表單是否符合要求
const isFormValid = computed(() => {
  return postContent.value.trim() !== '' && uploadedImages.value.length > 0
})

// 格式化 description，將內容和標籤合併
const formatDescription = () => {
  let description = postContent.value.trim()

  if (postTags.value.length > 0) {
    const tagsString = postTags.value.map((tag) => `#${tag.replace(/\s+/g, '_')}`).join(' ')
    description = description ? `${description}\n\n${tagsString}` : tagsString
  }

  return description
}

const createId = () => {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Sortable.js
onMounted(() => {
  Sortable.create(sortableContainer.value, {
    animation: 150, // 拖曳時的動畫效果
    ghostClass: 'sortable-ghost', // 拖曳中的元素樣式
    onEnd(event) {
      nextTick(() => {
        const [movedItem] = uploadedImages.value.splice(event.oldIndex, 1)
        uploadedImages.value.splice(event.newIndex, 0, movedItem)
      })
    },
  })
})

// 發布貼文 - 支援多圖片
const originalPublishPost = async () => {
  if (postContent.value.length > 500) {
    toastStore.showError('貼文內容不能超過500字')
    return
  }

  if (!isFormValid.value) {
    toastStore.showError('請至少輸入內容與上傳圖片')
    return
  }

  try {
    const description = formatDescription()
    const imageFiles = uploadedImages.value.map((img) => img.file)

    await postStore.createPost(imageFiles, description, route.params.userId || '')

    // 清空表單
    postContent.value = ''
    newTag.value = ''
    postTags.value = []
    uploadedImages.value = []
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

// 處理多文件上傳
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)

  if (!files.length) return

  // 檢查數量限制
  if (uploadedImages.value.length + files.length > 10) {
    toastStore.showError('最多只能上傳10張圖片')
    return
  }

  files.forEach((file) => {
    // 檢查圖片大小
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toastStore.showError(`圖片 ${file.name} 大小不能超過 5MB`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImages.value.push({
        id: createId(),
        file: file,
        url: e.target.result,
        name: file.name,
        size: file.size,
      })
    }
    reader.onerror = () => {
      toastStore.showError(`圖片 ${file.name} 讀取失敗`)
    }
    reader.readAsDataURL(file)
  })

  // 清空 input 以允許重複選擇相同檔案
  event.target.value = ''
}

// 移除單張圖片
const removeImage = (index) => {
  uploadedImages.value.splice(index, 1)
}

// 添加標籤
const addTag = () => {
  // 格式化標籤，移除多餘的 #，只保留一個 #
  let tag = newTag.value.trim().replace(/#/g, '')

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

const isDragging = ref(false)

// 處理拖曳進入事件
const handleDragOver = () => {
  isDragging.value = true
}

// 處理拖曳離開事件
const handleDragLeave = () => {
  isDragging.value = false
}

// 處理拖曳放下事件
const handleDrop = (event) => {
  isDragging.value = false

  const files = Array.from(event.dataTransfer.files)

  if (!files.length) return

  // 檢查數量限制
  if (uploadedImages.value.length + files.length > 10) {
    toastStore.showError('最多只能上傳10張圖片')
    return
  }

  files.forEach((file) => {
    // 檢查圖片大小
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toastStore.showError(`圖片 ${file.name} 大小不能超過 5MB`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImages.value.push({
        id: createId(),
        file: file,
        url: e.target.result,
        name: file.name,
        size: file.size,
      })
    }
    reader.onerror = () => {
      toastStore.showError(`圖片 ${file.name} 讀取失敗`)
    }
    reader.readAsDataURL(file)
  })
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
  position: relative;

  .post-textarea {
    @include base-input($borderRadius: 12px);
    min-height: 200px;
    font-size: 16px;
    line-height: 1.5;
  }

  .char-count {
    position: absolute;
    bottom: 8px;
    right: 12px;
    font-size: 12px;
    color: $text-secondary;
    background: rgba($background, 0.9);
    padding: 2px 6px;
    border-radius: 4px;
    backdrop-filter: blur(4px);
    transition: color $transition-speed ease;

    &.char-limit-warning {
      color: $danger-color;
      font-weight: 500;
    }
  }
}

.image-upload-section {
  .upload-area {
    border: 2px dashed $border-color;
    border-radius: 12px;
    padding: 30px 20px;
    text-align: center;
    background: $surface-alt;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 16px;

    &.dragging {
      border-color: $primary-color;
      background: $surface-hover;
    }

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
      display: block;
      color: $text-secondary;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .upload-count {
      display: block;
      color: $text-secondary;
      font-size: 12px;
      opacity: 0.8;
    }
  }

  .images-preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    margin-top: 16px;

    .preview-item {
      cursor: move;
      user-select: none;
      position: relative;
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      background: $surface-alt;
      border: 1px solid $border-color;

      &:hover {
        .preview-image {
          transform: scale(1.05);
        }

        .remove-image-btn {
          opacity: 1;
        }
      }

      .preview-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.2s ease;

        @media (hover: none) {
          transform: none !important;
        }
      }

      .remove-image-btn {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 24px;
        height: 24px;
        border: none;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all $transition-speed ease;
        opacity: 0;

        &:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: scale(1.1);
        }

        @media (hover: none) {
          opacity: 1;
          transform: none !important;
          background: rgba(0, 0, 0, 0.7) !important;
        }

        i {
          font-size: 12px;
          color: white;
          margin: 0;
        }
      }
    }
  }

  .file-input {
    display: none;
  }
}

.sortable-ghost {
  opacity: 0.4;
  background: #f0f0f0;
}

.sortable-fallback {
  opacity: 0.8;
  background: #fff;
  border: 2px dashed #ccc;
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
  .images-preview-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
  }
}
</style>
