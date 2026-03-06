export interface PixelCrop {
  x: number
  y: number
  width: number
  height: number
}

export const getCroppedBlob = (
  imageSrc: string,
  crop: PixelCrop,
  mimeType = 'image/jpeg'
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = crop.width
      canvas.height = crop.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
        mimeType,
        0.92
      )
    }
    img.onerror = reject
    img.src = imageSrc
  })
