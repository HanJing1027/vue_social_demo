<template>
  <svg>
    <use :href="`${sprite}#icon-${icon}`" />
  </svg>
</template>

<script setup>
import sprite from '@/assets/icons/sprite.svg'

const props = defineProps({
  icon: {
    type: String,
  },
})
</script>

<style lang="scss" setup></style>
