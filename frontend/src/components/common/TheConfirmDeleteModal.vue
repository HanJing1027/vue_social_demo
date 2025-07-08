<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div class="modal-overlay" v-if="isVisible">
        <Transition name="modal-slide">
          <div class="modal-container" v-if="isVisible" @click.stop>
            <div class="modal-header">
              <h3 class="modal-title">{{ confirmStore.title || title }}</h3>
              <button class="close-btn" @click="handleCancel">
                <i class="bx bx-x"></i>
              </button>
            </div>

            <div class="modal-body">
              <div class="icon-container">
                <i class="bx bx-error-circle warning-icon"></i>
              </div>
              <p class="modal-message">{{ confirmStore.message || message }}</p>
            </div>

            <div class="modal-actions">
              <button class="cancel-btn" @click="handleCancel">取消</button>
              <button class="confirm-btn" @click="handleConfirm">確定刪除</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useConfirmStore } from '@/stores/modules/confirmStore'

const confirmStore = useConfirmStore()

const props = defineProps({
  title: {
    type: String,
    default: '確認刪除',
  },
  message: {
    type: String,
    default: '您確定要刪除此項目嗎？此操作無法恢復',
  },
})

const isVisible = computed(() => confirmStore.isVisible)

const handleCancel = () => {
  confirmStore.cancel()
}

const handleConfirm = () => {
  confirmStore.confirm()
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

// 背景淡入淡出動畫
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

// 彈窗滑動動畫
.modal-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.modal-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
}

.modal-slide-enter-from {
  transform: translateY(-100vh);
  opacity: 0;
}

.modal-slide-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding: 80px 20px 20px;
}

.modal-container {
  background: $surface;
  border-radius: 16px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 420px;
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;

  .modal-title {
    font-size: 20px;
    font-weight: 600;
    color: $text-color;
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    color: $text-secondary;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    transition: all 0.2s ease;

    i {
      font-size: 20px;
    }

    &:hover {
      background: $surface-hover;
      color: $text-color;
    }
  }
}

.modal-body {
  padding: 24px;
  text-align: center;

  .icon-container {
    margin-bottom: 16px;

    .warning-icon {
      font-size: 48px;
      color: $danger-color;
      filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.2));
    }
  }

  .modal-message {
    font-size: 15px;
    color: $text-secondary;
    line-height: 1.5;
    margin: 0;
  }
}

.modal-actions {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;

  .cancel-btn {
    flex: 1;
    padding: 12px 20px;
    background: $surface-alt;
    border: 1px solid $border-light;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: $text-color;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: $surface-hover;
      border-color: $border-color;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .confirm-btn {
    flex: 1;
    padding: 12px 20px;
    background: linear-gradient(135deg, $danger-color 0%, #dc2626 100%);
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);

    &:hover {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// 響應式設計
@media (max-width: 768px) {
  .modal-overlay {
    padding: 40px 16px 16px;
  }

  .modal-container {
    max-width: none;
  }

  .modal-header {
    padding: 16px 20px 0;

    .modal-title {
      font-size: 18px;
    }
  }

  .modal-body {
    padding: 20px;

    .modal-message {
      font-size: 14px;
    }
  }

  .modal-actions {
    padding: 0 20px 20px;

    .cancel-btn,
    .confirm-btn {
      padding: 14px 20px;
      font-size: 15px;
    }
  }
}
</style>
