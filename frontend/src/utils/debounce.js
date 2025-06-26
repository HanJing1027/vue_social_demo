/**
 * 防抖函數 - 限制 function 執行的頻率
 *
 * @param {Function} fn - 需要防抖的函數
 * @param {number} delay - 延遲時間（毫秒）
 * @returns {Function} 防抖後的函數
 */
export function debounce(fn, delay) {
  let debounceTimer

  return (...args) => {
    clearTimeout(debounceTimer) // 清除前一次的定時器
    debounceTimer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
