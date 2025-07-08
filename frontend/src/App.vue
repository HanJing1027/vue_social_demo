<template>
  <template v-if="$route.path !== '/login'">
    <header>
      <NavBar />
    </header>

    <TheLayout>
      <router-view></router-view>
    </TheLayout>
  </template>

  <template v-else>
    <router-view></router-view>
  </template>

  <template v-if="$route.path !== '/login'">
    <footer>
      <Footer />
    </footer>
  </template>

  <GlobalModals />
</template>

<script setup>
import TheLayout from '@/components/layout/TheLayout.vue'
import NavBar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'
import GlobalModals from '@/components/global/GlobalModals.vue'
</script>

<style lang="scss" scoped></style>
