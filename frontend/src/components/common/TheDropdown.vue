<template>
  <div class="dropdown" ref="dropdownRef">
    <button @click="toggleDropdown" class="dropdown-trigger" :class="triggerClass">
      <slot name="trigger">
        <i class="bx bx-dots-horizontal-rounded"></i>
      </slot>
    </button>

    <div v-if="isOpen" class="dropdown-menu" :class="menuClass">
      <slot name="menu" :close="closeDropdown">
        <!-- 選單項目顯示在這裡 -->
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  triggerClass: {
    type: String,
    default: '',
  },
  menuClass: {
    type: String,
    default: '',
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['open', 'close'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value

  if (isOpen.value) {
    emit('open')
  } else {
    emit('close')
  }
}

const closeDropdown = () => {
  isOpen.value = false
  emit('close')
}

const handleClickOutside = (event) => {
  if (props.closeOnClickOutside && dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  if (props.closeOnClickOutside) {
    document.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  if (props.closeOnClickOutside) {
    document.removeEventListener('click', handleClickOutside)
  }
})

// 暴露組件內部的方法和數據給父組件
defineExpose({
  close: closeDropdown,
  toggle: toggleDropdown,
  isOpen: () => isOpen.value,
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.dropdown {
  position: relative;
  display: inline-block;

  .dropdown-trigger {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color $transition-speed ease;

    &:hover {
      background-color: rgba($text-secondary, 0.1);
    }

    i {
      font-size: 20px;
      color: $text-secondary;
    }
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    padding: 8px 0;
    background: $surface;
    border: 1px solid $border-light;
    border-radius: 8px;
    box-shadow: 0 4px 12px $shadow-light;
    z-index: 1000;
    min-width: 140px;
    overflow: hidden;
    animation: dropdownFadeIn 0.2s ease;
  }

  @keyframes dropdownFadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
