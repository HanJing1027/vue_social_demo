<template>
  <main class="content">
    <slot></slot>
  </main>
</template>

<script setup></script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.content {
  max-width: 1200px;
  margin: 80px auto 30px;
  padding: 20px;
}

@media (max-width: $mobile-breakpoint) {
  .content {
    padding: 10px;
  }
}
</style>
