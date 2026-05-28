const getImageUrl = (image) => {
  if (typeof image === 'string') {
    const normalized = image.trim()
    return normalized || ''
  }

  if (Array.isArray(image)) {
    const firstValidImage = image.find((item) => typeof item === 'string' && item.trim())
    return firstValidImage ? firstValidImage.trim() : ''
  }

  return ''
}

export default getImageUrl
