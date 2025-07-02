<template>
  <section>
    <h2 class="search-title">
      搜尋結果：
      <span>{{ keyword }}</span>
    </h2>

    <PostList :isEmpty="searchResultList.length === 0">
      <template v-if="searchResultList.length > 0">
        <PostCard v-for="post in searchResultList" :key="post.id" :post="post" />
      </template>

      <template v-else>
        <div class="no-posts-message">
          <p>目前沒有符合條件的內容，試試其他關鍵字吧！</p>
        </div>
      </template>
    </PostList>
  </section>
</template>

<script setup>
import PostCard from '@/components/post/PostCard.vue'
import PostList from '@/components/post/PostList.vue'

import { ref, computed, onMounted } from 'vue'
import { usePostStore } from '@/stores/modules/postStore'
import { useRoute } from 'vue-router'

const postStore = usePostStore()
const route = useRoute()

const searchResultList = computed(() => postStore.searchResult || [])
const keyword = computed(() => route.query.keyword)

onMounted(() => {
  if (!keyword.value) {
    route.replace({ name: 'home' })
  } else {
    postStore.searchPostsResult(keyword.value)
  }

  postStore.loadAllPosts()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.search-title {
  cursor: default;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 1.5rem 0 3rem;
  color: $text-color;
  position: relative;

  span {
    color: $primary-color;
  }

  // 簡潔的底部線條
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: $primary-color;
    border-radius: 2px;
  }

  // 響應式設計
  @media (max-width: 768px) {
    margin: 1.5rem 0 2.5rem;

    &::after {
      width: 45px;
      height: 2px;
    }
  }

  @media (max-width: 480px) {
    margin: 1rem 0 2rem;

    &::after {
      width: 35px;
    }
  }
}

.no-posts-message {
  text-align: center;
  color: $text-secondary;
  font-size: 16px;
  font-weight: 600;
  margin-top: 20px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: $shadow-light;

  p {
    margin: 0;
    line-height: 1.5;
  }
}
</style>
