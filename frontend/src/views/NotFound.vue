<template>
  <div class="not-found">
    <div class="background-pattern"></div>
    <h1 class="error-code">404</h1>
    <p class="error-message">抱歉，您訪問的頁面不存在。</p>
    <router-link to="/" class="back-home-btn">返回首頁</router-link>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;

.not-found {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  text-align: center;
  background: linear-gradient(135deg, $surface, $background);
  color: $text-color;
  overflow: hidden;
  padding: 0 16px;

  .background-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 0;
  }

  .error-code {
    font-size: 8rem;
    font-weight: 800;
    color: $primary-color;
    margin-bottom: 1rem;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1;

    @media (max-width: $tablet-breakpoint) {
      font-size: 6rem;
    }

    @media (max-width: $mobile-breakpoint) {
      font-size: 5rem;
    }

    @media (max-width: $small-phone-breakpoint) {
      font-size: 4rem;
    }
  }

  .error-message {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    color: $text-secondary;
    z-index: 1;

    @media (max-width: $tablet-breakpoint) {
      font-size: 1.3rem;
    }

    @media (max-width: $mobile-breakpoint) {
      font-size: 1.2rem;
    }

    @media (max-width: $small-phone-breakpoint) {
      font-size: 1rem;
    }
  }

  .back-home-btn {
    display: inline-block;
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: 600;
    color: $background;
    background-color: $primary-color;
    border-radius: 8px;
    text-decoration: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all $transition-speed ease;
    z-index: 1;

    &:hover {
      background-color: $surface-hover;
      color: $primary-color;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      transform: translateY(-3px);
    }

    &:active {
      transform: scale(0.95);
    }

    @media (max-width: $tablet-breakpoint) {
      font-size: 0.9rem;
      padding: 10px 20px;
    }

    @media (max-width: $mobile-breakpoint) {
      font-size: 0.8rem;
      padding: 8px 16px;
    }

    @media (max-width: $small-phone-breakpoint) {
      font-size: 0.75rem;
    }
  }
}
</style>
