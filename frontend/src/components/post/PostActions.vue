<template>
  <div class="post-actions">
    <div class="action-icons">
      <div class="icon-item heart-action" :class="{ active: isLiked }" @click.stop="toggleLike">
        <i :class="isLiked ? 'bxs-heart' : 'bx-heart'" class="bx"></i>
        <span class="action-count">{{ likeCount }}</span>
      </div>
      <div class="icon-item comment-action" @click.stop="handlePostClick">
        <i class="bx bx-message-square"></i>
        <span class="action-count">{{ commentCount }}</span>
      </div>
      <div class="icon-item star-action" :class="{ active: isSaved }" @click.stop="toggleSave">
        <i :class="isSaved ? 'bxs-star' : 'bx-star'" class="bx"></i>
        <span class="action-count">{{ saveCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useModalStore } from '@/stores/modules/modalStore'
import { usePostStore } from '@/stores/modules/postStore'

const props = defineProps({
  post: {
    type: Object,
    default: () => ({}),
  },
})

const modalStore = useModalStore()
const postStore = usePostStore()

// 定義響應式狀態
const isLiked = ref(props.post.likedByMe)
const isSaved = ref(props.post.favoredByMe)
const likeCount = ref(props.post.liked_bies)
const commentCount = ref(props.post.comments)
const saveCount = ref(props.post.favored_bies)

// 監聽 props 變化，確保帳號切換時即時正確反饋
watch(
  () => props.post,
  (newPost) => {
    isLiked.value = newPost.likedByMe || false
    isSaved.value = newPost.favoredByMe || false
    likeCount.value = newPost.liked_bies || 0
    commentCount.value = newPost.comments || 0
    saveCount.value = newPost.favored_bies || 0
  },
  { deep: true, immediate: true }
)

// 按讚功能
const toggleLike = async () => {
  // 保存原始狀態 用於錯誤時能夠回滾
  const originalLiked = isLiked.value
  const originalCount = likeCount.value

  // 先樂觀更新 UI 用於即時反饋
  isLiked.value = !originalLiked
  likeCount.value += isLiked.value ? 1 : -1

  try {
    await postStore.toggleLikePost(props.post.id)
  } catch (error) {
    // 調用失敗 回滾到原始狀態
    isLiked.value = originalLiked
    likeCount.value = originalCount
  }
}

// 收藏功能
const toggleSave = () => {
  isSaved.value = !isSaved.value
  saveCount.value += isSaved.value ? 1 : -1
}

// 點擊評論圖示打開詳情彈跳視窗
const handlePostClick = () => {
  modalStore.openModal('postDetails')
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.post-actions {
  padding: 12px 16px;
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
</style>
