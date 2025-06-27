export const formatPostContent = (description, maxLength = 80) => {
  if (!description) return { content: '', tags: [] }

  // 抽出標籤
  const tags = description.match(/#[\u4e00-\u9fa5\w]+/g) || []

  // 移除標籤，保留內容
  let content = description.replace(/#[\u4e00-\u9fa5\w]+/g, '').trim()

  // 移除多餘空白
  content = content.replace(/\s+/g, ' ')

  // 限制內文長度
  if (content.length > maxLength) {
    content = content.substring(0, maxLength)
  }
  return {
    content,
    tags,
    // tags: tags.map((tag) => tag.replace('#', '')), // 移除 # 符號
  }
}

export const formatTimeAgo = (dateString) => {
  if (!dateString) return '未知時間'

  const now = new Date()
  const date = new Date(dateString)
  const hours = Math.floor((now - date) / (1000 * 60 * 60))

  if (hours < 1) return '剛剛'
  if (hours < 24) return `${hours}小時前`
  if (hours < 48) return '1天前'

  return date.toLocaleDateString('zh-TW')
}
