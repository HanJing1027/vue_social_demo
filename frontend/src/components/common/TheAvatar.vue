<template>
  <img v-if="src" :src="src" alt="avatar" class="avatar" />
  <i v-else class="bx bxs-user avatar"></i>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
  },
  width: {
    type: Number,
    default: 34,
  },
  height: {
    type: Number,
    default: 34,
  },
  fontSize: {
    type: Number,
    default: 20,
  },
})

const avatarWidth = computed(() => `${props.width}px`)
const avatarHeight = computed(() => `${props.height}px`)
const avatarFontSize = computed(() => `${props.fontSize}px`)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: v-bind(avatarWidth);
  height: v-bind(avatarHeight);
  border-radius: 50%;
  background-color: $surface-alt;
  font-size: v-bind(avatarFontSize);
  color: $text-color;
}
</style>
