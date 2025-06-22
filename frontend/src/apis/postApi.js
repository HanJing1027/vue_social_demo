import { post } from './request'

export async function creatPost(image, description) {
  const formData = new FormData()
  formData.append('files.image', image)
  formData.append('data', JSON.stringify({ description }))
}
