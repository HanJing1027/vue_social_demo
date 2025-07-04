<template>
  <div class="login-page">
    <img src="@/assets/phone.png" alt="手機上顯示的社群網站主頁展示圖" />
    <div class="login-from">
      <img src="@/assets/logo.svg" alt="Logo" />
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">電子郵件：</label>
          <input
            v-model="formData.email"
            id="email"
            type="email"
            name="email"
            placeholder="請輸入電子郵件"
          />
        </div>

        <div class="form-group" v-if="!isLogin">
          <label for="username">用戶名稱：</label>
          <input
            v-model="formData.username"
            id="username"
            type="text"
            name="username"
            placeholder="請輸入用戶名稱"
          />
        </div>

        <div class="form-group">
          <label for="password">密碼：</label>
          <input
            v-model="formData.password"
            id="password"
            type="password"
            name="password"
            placeholder="請輸入密碼"
          />
        </div>
        <div class="form-group" v-if="!isLogin">
          <label for="confirmPassword">確認密碼：</label>
          <input
            v-model="formData.confirmPassword"
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="請輸入確認密碼"
            :class="{ error: showPasswordMismatch }"
          />
          <span class="password-hint" :class="{ show: showPasswordMismatch }">
            密碼與確認密碼不一致
          </span>
        </div>

        <button type="submit" class="login-btn">
          {{ isLogin ? '登入' : '註冊' }}
        </button>

        <p class="info">
          {{ isLogin ? '還沒有帳號？' : '已經有帳號了？' }}
          <span @click.stop="toggleAuthMode">{{ isLogin ? '點擊註冊' : '前往登入' }}</span>
        </p>

        <div v-if="!isLogin" class="agreement">
          <input v-model="agreement" id="agreement" type="checkbox" />
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/userStore'
import { useToastStore } from '@/stores/modules/toastStore'
import { debounce } from '@/utils/debounce'
import { validateLoginForm, validateRegisterForm } from '@/utils/validation'

const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore()

const isLogin = ref(true) // 初始狀態為登入模式
const agreement = ref(false)

const formData = reactive({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
})

// 切換登入/註冊模式
const toggleAuthMode = () => {
  isLogin.value = !isLogin.value
  resetForm()
}

// 重置表單
const resetForm = () => {
  formData.email = ''
  formData.username = ''
  formData.password = ''
  formData.confirmPassword = ''
}

// 密碼不一致提示
const showPasswordMismatch = computed(() => {
  return (
    !isLogin.value &&
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword
  )
})

// 表單驗證
const validateForm = () => {
  let verificationResult

  if (!isLogin.value) {
    // 註冊模式驗證
    verificationResult = validateRegisterForm(formData, agreement.value)
  } else {
    // 登入模式驗證
    verificationResult = validateLoginForm(formData)
  }

  if (!verificationResult.isValid) {
    // 如果驗證失敗 顯示錯誤訊息
    toastStore.showError(verificationResult.errors[0])
    return false
  }

  return true
}

// 登入/註冊 表單提交
const originalHandleSubmit = async () => {
  if (!validateForm()) return

  try {
    if (!isLogin.value) {
      // 註冊提交 邏輯
      await userStore.registerUser(formData)

      toastStore.showSuccess('註冊成功！')

      resetForm()
      isLogin.value = true // 切換到登入模式
    } else {
      // 登入提交 邏輯
      await userStore.loginUser(formData)

      setTimeout(() => {
        resetForm()
        router.push({ name: 'home' }) // 登入成功後跳轉到首頁
      }, 300)
    }
  } catch (error) {
    if (!isLogin.value) {
      // 註冊失敗處理
      if (!error.response) {
        toastStore.showError('註冊失敗，請稍後再試。')
      }
      if (error.response.status === 400) {
        toastStore.showError('信箱已被註冊，請使用其他信箱。')
      }
    } else {
      // 登入失敗處理
      if (!error.response) {
        toastStore.showError('登入失敗，請稍後再試。')
      }
      if (error.response.status === 400) {
        toastStore.showError('信箱或密碼錯誤，請重新輸入。')
      }
      console.error('登入失敗:', error)
    }
  } finally {
    agreement.value = false // 重置協議勾選狀態
  }
}

const handleSubmit = debounce(originalHandleSubmit, 300)
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
  max-width: 1400px;
  margin: 0 auto;
  background: $background;
  padding: 0 2rem;
  gap: 4rem;

  @media (max-width: 1200px) {
    gap: 2rem;
    padding: 0 1rem;
  }

  @media (max-width: $tablet-breakpoint) {
    grid-template-columns: 1fr;
    padding: 2rem;
    gap: 2rem;
  }

  @media (max-width: $mobile-breakpoint) {
    padding: 1rem;
    gap: 1rem;
  }

  // 左邊圖片容器
  .image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    @media (max-width: $tablet-breakpoint) {
      order: 2;
    }

    @media (max-width: $mobile-breakpoint) {
      display: none;
    }
  }

  > img {
    max-width: 450px;
    width: 100%;
    height: auto;
    object-fit: contain;

    @media (max-width: 1200px) {
      max-width: 400px;
    }

    @media (max-width: $tablet-breakpoint) {
      display: none;
      max-width: 350px;
      order: 2;
    }

    @media (max-width: $mobile-breakpoint) {
      display: none;
    }
  }

  .login-from {
    width: 425px;
    max-width: 100%;
    box-shadow: 0px 4px 48px $shadow-light;
    border-radius: 32px;
    background: $surface;
    padding: 74px 50px;
    display: grid;
    place-items: center;
    gap: 52px;
    border: 1px solid $border-light;

    @media (max-width: 1200px) {
      width: 380px;
      padding: 60px 40px;
    }

    @media (max-width: $tablet-breakpoint) {
      order: 1;
      width: 100%;
      max-width: 400px;
    }

    @media (max-width: $mobile-breakpoint) {
      padding: 40px 30px;
      gap: 30px;
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

          &.error {
            border-color: #ef4444;
            background: rgba(239, 68, 68, 0.05);

            &:focus {
              border-color: #ef4444;
              box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
            }
          }

          @media (max-width: $mobile-breakpoint) {
            padding: 14px 16px;
          }
        }

        .password-hint {
          font-size: 12px;
          color: #ef4444;
          opacity: 0;
          transform: translateY(-8px);
          transition: all 0.3s ease;
          margin-top: 4px;
          font-weight: 500;
          min-height: 16px;

          &.show {
            opacity: 1;
            transform: translateY(0);
          }

          @media (max-width: $mobile-breakpoint) {
            font-size: 11px;
            min-height: 14px;
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

      @media (hover: none) {
        .login-btn:hover {
          opacity: 1;
          transform: none;
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
