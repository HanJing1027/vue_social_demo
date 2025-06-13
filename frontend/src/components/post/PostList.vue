<template>
  <div class="post-list">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.post-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: $mobile-breakpoint) {
  .post-list {
    grid-template-columns: 1fr;
  }
}
</style>
