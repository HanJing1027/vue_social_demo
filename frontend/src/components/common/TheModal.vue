<template>
  <Teleport to="body">
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <!-- 關閉按鈕 -->
        <button class="close-btn" @click="handleClose">
          <i class="bx bx-x"></i>
        </button>

        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

// 定義 props
const props = defineProps({
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close'])

// 關閉模態框
const handleClose = () => {
  emit('close')
}

// 點擊遮罩關閉
const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    emit('close')
  }
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
}

// 平板尺寸調整
@media (max-width: 768px) and (min-width: $mobile-breakpoint) {
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
}
</style>
