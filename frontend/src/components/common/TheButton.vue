<template>
  <button type="button" class="base-button" :class="{ primary: color === 'primary', reverse }">
    <i class="bx" :class="bxIcon"></i>
    <slot></slot>
  </button>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    default: 'primary',
  },
  bxIcon: {
    type: String,
  },
  reverse: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.base-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;

  i {
    font-size: 15px;
  }

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &.primary {
    background: $primary-color;
    color: $surface;

    &:hover {
      box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.3);
    }
  }

  &.reverse {
    background: $surface-alt;
    border: 1px solid $border-color;
    color: $text-secondary;

    &:hover {
      box-shadow: none;
      background: $surface-hover;
    }
  }
}
</style>
