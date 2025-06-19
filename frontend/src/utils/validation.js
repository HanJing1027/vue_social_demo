// 驗證規則 module
export const validationRules = {
  // 必填驗證
  required: (value, columnName) => {
    if (!value || value.toString().trim() === '') {
      return `${columnName}為必填欄位！`
    }
    return null
  },

  // 電子郵件驗證
  email: (value) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return '請輸入有效的電子郵件地址！'
    }
    return null
  },

  // 用戶名稱驗證
  username: (value) => {
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
      return '名稱必須是3到20個字母、數字或下劃線！'
    }
    return null
  },

  // 密碼驗證
  password: (value) => {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(value)) {
      return '密碼必須至少6個字符，並包含至少一個大寫字母、一個小寫字母和一個數字！'
    }
    return null
  },

  // 確認密碼驗證
  confirmPassword: (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return '密碼和確認密碼不一致！'
    }
    return null
  },
}

// 驗證註冊表單
export const validateRegisterForm = (formData, agreement) => {
  const errors = []

  // 驗證必填驗證
  const requiredFieldList = [
    { value: formData.email, name: '電子郵件' },
    { value: formData.username, name: '用戶名稱' },
    { value: formData.password, name: '密碼' },
    { value: formData.confirmPassword, name: '確認密碼' },
  ]
  requiredFieldList.forEach((field) => {
    const error = validationRules.required(field.value, field.name)

    if (error) errors.push(error)
  })

  // 如果所有欄位都有填寫了才進行其他驗證
  if (errors.length === 0) {
    const emailError = validationRules.email(formData.email)
    if (emailError) errors.push(emailError)

    const usernameError = validationRules.username(formData.username)
    if (usernameError) errors.push(usernameError)

    const passwordError = validationRules.password(formData.password)
    if (passwordError) errors.push(passwordError)

    const confirmPasswordError = validationRules.confirmPassword(
      formData.password,
      formData.confirmPassword
    )
    if (confirmPasswordError) errors.push(confirmPasswordError)

    if (!agreement) {
      errors.push('請同意隱私政策和使用條款！')
    }
  }
  const hasNoErrors = errors.length === 0
  return {
    isValid: hasNoErrors,
    errors,
  }
}

// 驗證登入表單
export const validateLoginForm = (formData) => {}
