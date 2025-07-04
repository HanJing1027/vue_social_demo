<template>
  <div class="post-actions">
    <div class="action-icons">
      <div
        class="icon-item heart-action"
        :class="{ active: post.likedByMe }"
        @click.stop="toggleLike"
      >
        <i :class="post.likedByMe ? 'bxs-heart' : 'bx-heart'" class="bx"></i>
        <span class="action-count">{{ post.liked_bies || 0 }}</span>
      </div>

      <div class="icon-item comment-action" @click.stop="handlePostClick">
        <i class="bx bx-message-square"></i>
        <span class="action-count">{{ post.comments || 0 }}</span>
      </div>

      <div
        class="icon-item star-action"
        :class="{ active: post.favoredByMe }"
        @click.stop="toggleSave"
      >
        <i :class="post.favoredByMe ? 'bxs-star' : 'bx-star'" class="bx"></i>
        <span class="action-count">{{ post.favored_bies || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
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

// 按讚功能
const toggleLike = async () => {
  try {
    await postStore.toggleLikePost(props.post.id)
  } catch (error) {
    console.error('按讚失敗:', error)
  }
}

// 收藏功能
const toggleSave = async () => {
  try {
    await postStore.toggleFavorPost(props.post.id)
  } catch (error) {
    console.error('收藏失敗:', error)
  }
}

// 點擊評論圖示打開詳情彈跳視窗
const handlePostClick = () => {
  modalStore.openModal('postDetails')
  postStore.setCurrentPostId(props.post.id)
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

@media (hover: none) {
  // 禁用移動端的 hover 效果，但保持 active 狀態
  .heart-action:hover {
    background-color: transparent;

    i {
      color: $text-secondary;
      transform: none;
    }

    .action-count {
      color: $text-secondary;
    }
  }

  .comment-action:hover {
    background-color: transparent;

    i {
      color: $text-secondary;
      transform: none;
    }

    .action-count {
      color: $text-secondary;
    }
  }

  .star-action:hover {
    background-color: transparent;

    i {
      color: $text-secondary;
      transform: none;
    }

    .action-count {
      color: $text-secondary;
    }
  }

  .heart-action.active {
    i {
      color: $danger-color;
    }

    .action-count {
      color: $danger-color;
      font-weight: 600;
    }
  }

  .star-action.active {
    i {
      color: #f39c12;
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
