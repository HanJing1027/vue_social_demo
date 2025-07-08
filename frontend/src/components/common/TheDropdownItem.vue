<template>
  <button
    @click="handleClick"
    class="dropdown-item"
    :class="[variant, disabled && 'disabled']"
    :disabled="disabled"
  >
    <i v-if="icon" :class="icon"></i>
    <slot></slot>
  </button>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: '', // '', 'danger'
    validator: (value) => ['', 'danger'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.dropdown-item {
  width: 100%;
  background: transparent;
  border: none;
  padding: 12px 16px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: $text-color;
  transition: background-color $transition-speed ease;

  &:hover:not(.disabled) {
    background-color: $surface-hover;
  }

  &.danger {
    color: $danger-color;

    &:hover:not(.disabled) {
      background-color: $surface-danger;
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  i {
    font-size: 16px;
  }
}
</style>
