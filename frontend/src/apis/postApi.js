import { postFormData } from '@/apis/request'

export async function createPost(image, description) {
  const formData = new FormData()
  formData.append('files.image', image)
  formData.append('data', JSON.stringify({ description }))

  try {
    const response = await postFormData('/api/posts', formData, true)
    return response
  } catch (error) {
    throw error
  }
}
