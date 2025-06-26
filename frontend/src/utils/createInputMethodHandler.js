/**
 * 中文輸入法處理工具!!
 * 解決 macOS 注音輸入法在按 Enter 時的問題
 */

/**
 * 創建輸入法處理器
 * @param {Function} callback - Enter 鍵確認時的回調函數
 * @param {Object} options - 配置選項
 * @param {boolean} options.preventDefault - 是否阻止預設行為，預設是 true
 * @param {string} options.triggerKey - 觸發鍵，預設是 'Enter'
 * @returns {Object} - 包含事件處理函數的物件
 */

export const createInputMethodHandler = (callback, options = {}) => {
  const { preventDefault = true, triggerKey = 'Enter' } = options

  let isComposing = false

  const handleCompositionStart = () => {
    isComposing = true
  }

  const handleCompositionEnd = () => {
    isComposing = false
  }

  const handleKeyDown = (event) => {
    if (event.key === triggerKey && !isComposing) {
      if (preventDefault) {
        event.preventDefault()
      }
      callback(event)
    }
  }

  return {
    handleCompositionStart,
    handleCompositionEnd,
    handleKeyDown,
    isComposing: () => isComposing,
  }
}
