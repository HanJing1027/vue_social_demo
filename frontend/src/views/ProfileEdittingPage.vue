<template>
  <div class="profile-editing-page">
    <!-- 頂部導航 -->
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <i class="bx bx-arrow-back"></i>
      </button>
      <h1 class="page-title">編輯個人資料</h1>
    </div>

    <!-- 主要內容區 -->
    <div class="profile-content">
      <!-- 頭像編輯區 -->
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <TheAvatar
            v-if="!previewAvatar"
            :src="userStore.user.avatar"
            :width="130"
            :height="130"
            :fontSize="70"
          />
          <TheAvatar v-else :src="previewAvatar" :width="130" :height="130" :fontSize="70" />
          <!-- 修改頭像按鈕 -->
        </div>
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
      <form class="profile-form" @submit.prevent="handleSave">
        <!-- 基本資訊 -->
        <div class="form-section">
          <h3 class="section-title">基本資訊</h3>

          <div class="form-field">
            <label class="field-label">
              用戶名稱
              <span class="required">*</span>
            </label>
            <input
              v-model="profileData.username"
              type="text"
              class="form-input"
              placeholder="請輸入用戶名稱"
              required
            />
          </div>

          <div class="form-field">
            <label class="field-label">顯示名稱</label>
            <input
              v-model="profileData.name"
              type="text"
              class="form-input"
              placeholder="請輸入顯示名稱"
            />
          </div>

          <div class="form-field">
            <label class="field-label">手機號碼</label>
            <input
              v-model="profileData.mobilePhone"
              type="text"
              class="form-input"
              placeholder="請輸入手機號碼"
            />
          </div>

          <div class="form-field">
            <label class="field-label">個人簡介</label>
            <textarea
              v-model="profileData.intro"
              class="form-textarea"
              placeholder="介紹一下自己..."
              rows="4"
              maxlength="150"
            ></textarea>
            <span class="char-count">{{ (profileData.intro || '').length }}/150</span>
          </div>
        </div>

        <!-- 個人資訊 -->
        <div class="form-section">
          <h3 class="section-title">個人資訊</h3>

          <div class="form-field">
            <label class="field-label">個人網站</label>
            <input
              v-model="profileData.website"
              type="url"
              class="form-input"
              placeholder="https://example.com"
            />
          </div>

          <div class="form-field">
            <label class="field-label">性別</label>
            <i class="bx bx-chevron-down"></i>
            <select v-model="profileData.gender" class="form-input">
              <option value="" disabled>請選擇性別</option>
              <option value="M">男性</option>
              <option value="F">女性</option>
            </select>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="form-actions">
          <TheButton :bxIcon="`bx-reset`" :reverse="true" @click="resetProfile">重置</TheButton>
          <TheButton :btnType="`submit`" :bxIcon="`bxs-save`">儲存變更</TheButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import TheAvatar from '@/components/common/TheAvatar.vue'
import TheButton from '@/components/common/TheButton.vue'

import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/userStore'
import { useToastStore } from '@/stores/modules/toastStore'
import { updateUserApi } from '@/apis/updateUserProfileApi'
import { debounce } from '@/utils/debounce'

const router = useRouter()
const toastStore = useToastStore()
const userStore = useUserStore()

const userData = computed(() => userStore.user)

const avatarInput = ref(null)
const previewAvatar = ref(null)
const profileData = reactive({
  avatar: userData.value.avatar || '',
  username: userData.value.username || '',
  name: userData.value.name || '',
  mobilePhone: userData.value.mobilePhone || '',
  intro: userData.value.intro || '',
  website: userData.value.website || '',
  gender: userData.value.gender || 'M', // 預設為男性
})

// 用於重置功能
const originalProfileData = { ...profileData }

// 選擇頭像
const selectAvatar = () => {
  avatarInput.value?.click()
}

// 處理頭像變更
const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 驗證文件大小 (例如：5MB)
  if (file.size > 5 * 1024 * 1024) {
    toastStore.showError('圖片大小不能超過 5MB')
    return
  }

  try {
    // 上傳文件
    const avatarUrl = await updateUserApi.uploadFile(file)
    profileData.avatar = avatarUrl

    // 處理頭像預覽
    const BASE_URL = import.meta.env.VITE_API_BASE_URL
    previewAvatar.value = BASE_URL + avatarUrl

    toastStore.showSuccess('頭像更新成功！')

    // 清空文件輸入框
    if (avatarInput.value) {
      avatarInput.value.value = ''
    }
  } catch (error) {
    console.error('頭像上傳失敗:', error)
    toastStore.showError('頭像上傳失敗，請稍後再試')
  }
}

// 重置個人資料
const resetProfile = () => {
  Object.assign(profileData, originalProfileData) // 恢復到原始資料，確保不斷開 reactive
}

// 保存個人資料變更
const originalHandleSave = async () => {
  try {
    if (profileData.intro.length > 150) {
      toastStore.showError('個人簡介不能超過 150 字')
      return
    }

    await updateUserApi.updateUserData(profileData)
    toastStore.showSuccess('個人資料已儲存！')

    router.push({ name: 'profile' })
  } catch (error) {
    toastStore.showError('儲存個人資料失敗，請稍後再試')
  }
}

const handleSave = debounce(originalHandleSave, 300)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;
@use '@/assets/styles/_mixins.scss' as *;

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
  margin-bottom: 32px;
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
  position: relative;
  margin-bottom: 20px;

  i {
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateX(-50%);
    color: $text-secondary;
    pointer-events: none;
    font-size: 1.25rem;
  }

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

.form-input {
  @include base-input($borderRadius: 8px);
}

.form-textarea {
  @include base-input($borderRadius: 8px);
}

input[type='number'] {
  /* Chrome、Safari、Edge、Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  -moz-appearance: textfield;
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
