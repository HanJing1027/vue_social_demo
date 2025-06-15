<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
          @click="toastStore.removeToast(toast.id)"
        >
          <div class="toast-icon">
            <span v-if="toast.type === 'success'">✓</span>
            <span v-else>✕</span>
          </div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToastStore } from '@/stores/modules/toastStore'

const toastStore = useToastStore()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 300px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  border: 1px solid $border-light;
  background-color: $background;
  color: $text-color;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: $shadow-light;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 100%;
    animation: countdown 3s linear forwards;
  }

  &-success {
    &::after {
      background-color: $primary-color;
    }

    .toast-icon {
      color: $primary-color;
    }
  }

  &-error {
    &::after {
      background-color: $danger-color;
    }

    .toast-icon {
      color: $danger-color;
    }
  }
}

.toast-icon {
  margin-right: 8px;
  font-weight: bold;
  font-size: 16px;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
}

@keyframes countdown {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all $transition-speed ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform $transition-speed ease;
}
</style>
