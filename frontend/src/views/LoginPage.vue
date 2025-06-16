<template>
  <div class="login-page">
    <img src="../assets/phone.png" alt="手機上顯示的社群網站主頁展示圖" />
    <div class="login-from">
      <img src="../assets/logo.svg" alt="Logo" />
      <form>
        <div class="form-group">
          <label for="email">電子郵件：</label>
          <input id="email" type="email" name="email" placeholder="請輸入電子郵件" required />
        </div>

        <div class="form-group" v-if="!isLogin">
          <label for="username">用戶名稱：</label>
          <input id="username" type="text" name="username" placeholder="請輸入用戶名稱" required />
        </div>

        <div class="form-group">
          <label for="email">密碼：</label>
          <input id="password" type="password" name="password" placeholder="請輸入密碼" required />
        </div>

        <button type="submit" class="login-btn">
          {{ isLogin ? '登入' : '註冊' }}
        </button>

        <p class="info">
          {{ isLogin ? '還沒有帳號？' : '已經有帳號了？' }}
          <span @click="toggleAuthMode">{{ isLogin ? '點擊註冊' : '前往登入' }}</span>
        </p>

        <div v-if="!isLogin" class="agreement">
          <input id="agreement" type="checkbox" />
          <label for="agreement">
            勾選表示同意
            <a href="#" target="_blank">隱私政策</a>
            和
            <a href="#" target="_blank">使用條款</a>
          </label>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isLogin = ref(true)

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;
@use '@/assets/styles/_mixins.scss' as *;

.login-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
  height: 100vh;
  max-width: 100%;
  background: $background;
  padding: 0 20vw;

  @media (max-width: $tablet-breakpoint) {
    grid-template-columns: 1fr;
    padding: 2rem;
    gap: 2rem;
  }

  @media (max-width: $mobile-breakpoint) {
    padding: 1rem;
  }

  > img {
    max-width: 450px;
    width: 100%;
    height: auto;
    position: relative;
    top: 36px;
    justify-self: center;

    @media (max-width: $tablet-breakpoint) {
      justify-self: center;
      max-width: 350px;
      top: 0;
      order: 2;
    }

    @media (max-width: $mobile-breakpoint) {
      display: none;
    }
  }

  .login-from {
    justify-self: center;
    box-shadow: 0px 4px 48px $shadow-light;
    border-radius: 32px;
    background: $surface;
    padding: 74px 50px;
    display: grid;
    place-items: center;
    gap: 52px;
    width: 425px;
    border: 1px solid $border-light;

    @media (max-width: $tablet-breakpoint) {
      justify-self: center;
      width: 100%;
      max-width: 400px;
      order: 1;
    }

    @media (max-width: $mobile-breakpoint) {
      padding: 40px 30px;
      row-gap: 30px;
      border-radius: 16px;
      box-shadow: 0px 2px 24px $shadow-light;
    }

    @media (max-width: $small-phone-breakpoint) {
      padding: 30px 20px;
      width: 100%;
      background: transparent;
      box-shadow: none;
      border: none;
    }

    // Logo 樣式
    > img {
      width: 100px;
      height: auto;

      @media (max-width: $mobile-breakpoint) {
        width: 80px;
      }
    }

    form {
      display: grid;
      gap: 24px;
      width: 100%;

      .form-group {
        display: grid;
        row-gap: 8px;

        label {
          font-weight: 500;
          color: $text-color;
          font-size: 14px;
        }

        input {
          @include base-input(8px);
          background: $surface-alt;
          border: 1px solid $border-color;
          padding: 12px 16px;
          font-size: 14px;
          color: $text-color;
          transition: all $transition-speed ease;

          &::placeholder {
            color: $text-secondary;
          }

          &:focus {
            border-color: $primary-color;
            background: $surface;
            box-shadow: 0 0 0 3px $shadow-focus;
          }

          @media (max-width: $mobile-breakpoint) {
            padding: 14px 16px;
          }
        }
      }

      .login-btn {
        background: $primary-color;
        padding: 12px 0;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 10px;
        text-indent: 10px;
        text-align: center;
        cursor: pointer;
        transition: all $transition-speed ease;

        &:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        &:active {
          opacity: 0.8;
          transform: translateY(0);
        }

        @media (max-width: $mobile-breakpoint) {
          padding: 14px 0;
        }
      }

      .info {
        text-align: center;
        font-size: 14px;
        color: $text-color;

        span {
          cursor: pointer;
          color: $primary-color;
          font-weight: 600;
          transition: all $transition-speed ease;

          &:hover {
            opacity: 0.8;
          }
        }
      }

      .agreement {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 12px;
        color: $text-secondary;

        input[type='checkbox'] {
          width: 16px;
          height: 16px;
          margin: 0;
          flex-shrink: 0;
          accent-color: $primary-color;
          cursor: pointer;
        }

        label {
          cursor: pointer;
          user-select: none;
          font-weight: 400;

          a {
            color: $primary-color;
            text-decoration: none;
            font-weight: 500;

            &:hover {
              text-decoration: underline;
            }
          }
        }

        @media (max-width: $mobile-breakpoint) {
          font-size: 11px;
          gap: 6px;

          input[type='checkbox'] {
            width: 14px;
            height: 14px;
          }
        }
      }
    }
  }
}
</style>
