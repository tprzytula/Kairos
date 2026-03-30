import { useState, useCallback, useRef } from 'react'
import { type Area } from 'react-easy-crop'
import { getCroppedBlob } from '../../components/RecipeForm/cropUtils'

interface UseImageCropOptions {
  getUploadUrl: (extension: string, projectId?: string) => Promise<{ uploadUrl: string; imagePath: string }>
  projectId?: string
  initialPreviewUrl?: string | null
  initialImagePath?: string
  onError?: (message: string) => void
}

export const useImageCrop = ({
  getUploadUrl,
  projectId,
  initialPreviewUrl = null,
  initialImagePath = '',
  onError,
}: UseImageCropOptions) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreviewUrl)
  const [imagePath, setImagePath] = useState(initialImagePath)
  const [isUploading, setIsUploading] = useState(false)
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingImageSrc(URL.createObjectURL(file))
    e.target.value = ''
  }, [])

  const handleCropConfirm = useCallback(async (croppedAreaPixels: Area) => {
    if (!pendingImageSrc) return

    const previousPreview = previewUrl
    const previousPath = imagePath

    try {
      const croppedBlob = await getCroppedBlob(pendingImageSrc, croppedAreaPixels)
      const objectUrl = URL.createObjectURL(croppedBlob)
      setPreviewUrl(objectUrl)
      setPendingImageSrc(null)
      setIsUploading(true)

      const { uploadUrl, imagePath: path } = await getUploadUrl('jpg', projectId)
      await fetch(uploadUrl, {
        method: 'PUT',
        body: croppedBlob,
        headers: { 'Content-Type': 'image/jpeg' },
      })
      setImagePath(path)
    } catch {
      onError?.('Failed to upload image. Please try again.')
      setPreviewUrl(previousPreview)
      setImagePath(previousPath)
      setPendingImageSrc(null)
    } finally {
      setIsUploading(false)
    }
  }, [pendingImageSrc, previewUrl, imagePath, projectId, getUploadUrl, onError])

  const handleCropCancel = useCallback(() => {
    setPendingImageSrc(null)
  }, [])

  return {
    previewUrl,
    imagePath,
    isUploading,
    pendingImageSrc,
    fileInputRef,
    handleImageClick,
    handleFileChange,
    handleCropConfirm,
    handleCropCancel,
    setPreviewUrl,
    setImagePath,
  }
}
