<template>
  <div class="profile-editing-page">
    <!-- 頂部導航 -->
    <div class="page-header">
      <button class="back-btn">
        <i class="bx bx-arrow-back"></i>
      </button>
      <h1 class="page-title">編輯個人資料</h1>
    </div>

    <!-- 主要內容區 -->
    <div class="profile-content">
      <!-- 頭像編輯區 -->
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <TheAvatar :width="130" :height="130" :fontSize="70" />
        </div>
        <!-- 修改頭像按鈕 -->
        <button type="button" class="change-avatar-btn" @click="selectAvatar">
          <i class="bx bx-edit"></i>
          修改頭像
        </button>
        <input
          type="file"
          ref="avatarInput"
          class="avatar-input"
          accept="image/*"
          @change="handleAvatarChange"
        />
      </div>

      <!-- 表單區域 -->
      <form class="profile-form">
        <!-- 基本資訊 -->
        <div class="form-section">
          <h3 class="section-title">基本資訊</h3>

          <div class="form-field">
            <label class="field-label">
              用戶名稱
              <span class="required">*</span>
            </label>
            <input
              type="text"
              class="form-input"
              placeholder="請輸入用戶名稱"
              value="使用者名稱"
              required
            />
          </div>

          <div class="form-field">
            <label class="field-label">顯示名稱</label>
            <input
              type="text"
              class="form-input"
              placeholder="請輸入顯示名稱"
              value="yufeng_zhang"
            />
          </div>

          <div class="form-field">
            <label class="field-label">
              手機號碼
              <span class="required">*</span>
            </label>
            <input
              type="email"
              class="form-input"
              placeholder="請輸入手機號碼"
              value="user@example.com"
              required
            />
          </div>

          <div class="form-field">
            <label class="field-label">個人簡介</label>
            <textarea class="form-textarea" placeholder="介紹一下自己..." rows="4" maxlength="200">
熱愛攝影與生活分享 📸
咖啡愛好者 ☕
#攝影 #美食 #旅行</textarea
            >
            <span class="char-count">55/200</span>
          </div>
        </div>

        <!-- 個人資訊 -->
        <div class="form-section">
          <h3 class="section-title">個人資訊</h3>

          <div class="form-field">
            <label class="field-label">個人網站</label>
            <input
              type="url"
              class="form-input"
              placeholder="https://example.com"
              value="https://example.com"
            />
          </div>

          <div class="form-field">
            <label class="field-label">性別</label>
            <select class="form-input" v-model="selectedGender">
              <option value="">請選擇性別</option>
              <option value="male">男性</option>
              <option value="female">女性</option>
            </select>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="form-actions">
          <TheButton :bxIcon="`bx-reset`" :reverse="true">重置</TheButton>
          <TheButton :bxIcon="`bxs-save`">儲存變更</TheButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TheAvatar from '@/components/common/TheAvatar.vue'
import TheButton from '@/components/common/TheButton.vue'

const selectedGender = ref('')
const avatarInput = ref(null)

// 選擇頭像
const selectAvatar = () => {
  avatarInput.value?.click()
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.profile-editing-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px;
  min-height: 100vh;
  background-color: $background;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: $surface;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid $border-light;
  padding: 16px 0;
  margin: 0 -16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn,
.save-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all $transition-speed ease;
}

.back-btn {
  background: $surface;
  color: $text-secondary;
  border: 1px solid $border-light;

  &:hover {
    background: $surface-hover;
    color: $text-color;
  }

  i {
    font-size: 18px;
  }
}

.save-btn {
  background: $primary-color;
  color: white;

  &:hover {
    background: rgba(var(--primary-color-rgb), 0.9);
    transform: translateY(-1px);
  }

  i {
    font-size: 18px;
  }
}

.page-title {
  position: relative;
  font-size: 18px;
  font-weight: 600;
  color: $text-color;
  margin: 0;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    right: -10px;
    transform: translateY(-50%);
    width: 4px;
    height: 24px;
    background: $primary-color;
    vertical-align: middle;
  }
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.avatar-wrapper {
  position: relative;
  transition: transform $transition-speed ease;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity $transition-speed ease;

  i {
    font-size: 24px;
    margin-bottom: 4px;
  }

  span {
    font-size: 12px;
    font-weight: 500;
  }
}

.change-avatar-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: $primary-color;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all $transition-speed ease;
  box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.2);

  &:hover {
    background: rgba(var(--primary-color-rgb), 0.9);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  i {
    font-size: 16px;
  }
}

.avatar-input {
  display: none;
}

.form-section {
  background: $surface;
  border-radius: 16px;
  padding: 24px;
  box-shadow: $shadow-light;
  border: 1px solid $border-light;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: $text-color;
  margin: 0 0 20px 0;
  position: relative;
  padding-bottom: 8px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: $primary-color;
    border-radius: 2px;
  }
}

.form-field {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.field-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: $text-color;
  margin-bottom: 8px;

  .required {
    color: $danger-color;
    margin-left: 2px;
  }
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid $border-light;
  border-radius: 8px;
  font-size: 14px;
  color: $text-color;
  background: $surface;
  transition: all $transition-speed ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 3px $shadow-focus;
  }

  &::placeholder {
    color: $text-secondary;
  }
}

// 下拉選單特殊樣式
select.form-input {
  cursor: pointer;
  appearance: none;
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;

  option {
    background: $surface;
    color: $text-color;
    padding: 8px;
  }
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

.char-count {
  display: block;
  text-align: right;
  font-size: 12px;
  color: $text-secondary;
  margin-top: 4px;
}

.checkbox-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 0;
  transition: background-color $transition-speed ease;

  &:hover {
    background-color: $surface-hover;
    border-radius: 4px;
  }
}

.checkbox-input {
  width: 18px;
  height: 18px;
  accent-color: $primary-color;
  cursor: pointer;
}

.checkbox-text {
  font-size: 14px;
  font-weight: 500;
  color: $text-color;
}

.field-desc {
  font-size: 12px;
  color: $text-secondary;
  margin-left: 30px;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid $border-light;
}

/* 響應式設計 */
@media (max-width: $mobile-breakpoint) {
  .profile-editing-page {
    padding: 0 12px;
  }

  .page-header {
    margin: 0 -12px 20px;
    padding: 12px 16px;
  }

  .page-title {
    font-size: 16px;
  }

  .back-btn,
  .save-btn {
    padding: 6px 12px;
    font-size: 13px;

    i {
      font-size: 16px;
    }
  }

  .change-avatar-btn {
    padding: 8px 16px;
    font-size: 13px;

    i {
      font-size: 14px;
    }
  }

  .form-section {
    padding: 20px;
  }

  .section-title {
    font-size: 16px;
  }

  .form-actions {
    flex-direction: column;
  }
}

@media (max-width: $small-phone-breakpoint) {
  .profile-editing-page {
    padding: 0 8px;
  }

  .page-header {
    margin: 0 -8px 16px;
    gap: 12px;
    text-align: center;
  }

  .form-section {
    padding: 16px;
  }

  .avatar-overlay {
    i {
      font-size: 20px;
    }

    span {
      font-size: 10px;
    }
  }
}
</style>
