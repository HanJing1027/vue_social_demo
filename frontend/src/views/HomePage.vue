<template>
  <div class="content">
    <div class="post-list">
      <PostCard v-for="i in 5" :key="i" />
    </div>
  </div>
</template>

<script setup>
import PostCard from '@/components/PostCard.vue'
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.content {
  max-width: 1200px;
  margin: 30px auto;
  padding: 20px;
}

.post-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: $mobile-breakpoint) {
  .content {
    padding: 10px;
  }

  .post-list {
    grid-template-columns: 1fr;
  }
}
</style>
