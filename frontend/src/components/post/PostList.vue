<template>
  <div class="post-list" :class="{ empty: isEmpty }">
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  isEmpty: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.post-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  &.empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }
}

@media (max-width: $mobile-breakpoint) {
  .post-list {
    grid-template-columns: 1fr;
  }
}
</style>
