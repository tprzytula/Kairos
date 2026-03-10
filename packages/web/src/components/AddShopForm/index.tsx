import { useState, useCallback, useRef } from 'react'
import { Alert, CircularProgress, Typography } from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { type Area } from 'react-easy-crop'
import { IAddShopFormProps } from './types'
import {
  FormContainer,
  FormCard,
  FormContent,
  FormFieldsContainer,
  StyledTextField,
  ButtonContainer,
  SubmitButton,
  CancelButton,
  ImageUploadBox,
  ImagePreview,
} from './index.styled'
import ImageCropModal from '../RecipeForm/ImageCropModal'
import { getCroppedBlob } from '../RecipeForm/cropUtils'
import { getShopUploadUrl } from '../../api/shops/getUploadUrl'
import { useProjectContext } from '../../providers/ProjectProvider'

const AddShopForm = ({ onSubmit, onCancel, isSubmitting = false }: IAddShopFormProps) => {
  const { currentProject } = useProjectContext()
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imagePath, setImagePath] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setName(value)
    if (nameError) {
      setNameError('')
    }
  }, [nameError])

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

      const { uploadUrl, imagePath: path } = await getShopUploadUrl('jpg', currentProject?.id)
      await fetch(uploadUrl, {
        method: 'PUT',
        body: croppedBlob,
        headers: { 'Content-Type': 'image/jpeg' },
      })
      setImagePath(path)
    } catch {
      setSubmitError('Failed to upload image. Please try again.')
      setPreviewUrl(previousPreview)
      setImagePath(previousPath)
      setPendingImageSrc(null)
    } finally {
      setIsUploading(false)
    }
  }, [pendingImageSrc, previewUrl, imagePath, currentProject])

  const handleCropCancel = useCallback(() => {
    setPendingImageSrc(null)
  }, [])

  const validateForm = useCallback(() => {
    if (!name.trim()) {
      setNameError('Shop name is required')
      return false
    } else if (name.trim().length < 2) {
      setNameError('Shop name must be at least 2 characters')
      return false
    }
    return true
  }, [name])

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(name.trim(), imagePath || undefined)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Failed to create shop. Please try again.'
      )
    }
  }, [name, imagePath, validateForm, onSubmit])

  return (
    <FormContainer>
      {pendingImageSrc && (
        <ImageCropModal
          imageSrc={pendingImageSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
          aspect={1}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <FormCard>
        <FormContent>
          <ImageUploadBox onClick={handleImageClick} aria-label="Upload shop icon">
            {previewUrl ? (
              <ImagePreview src={previewUrl} alt="Shop icon preview" />
            ) : null}
            {isUploading ? (
              <CircularProgress size={24} sx={{ position: 'relative', zIndex: 1 }} />
            ) : !previewUrl ? (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AddPhotoAlternateIcon fontSize="small" />
                Add shop icon
              </Typography>
            ) : null}
          </ImageUploadBox>

          <form onSubmit={handleSubmit} noValidate>
            <FormFieldsContainer>
              <StyledTextField
                autoFocus
                fullWidth
                label="Shop Name"
                value={name}
                onChange={handleNameChange}
                error={!!nameError}
                helperText={nameError}
                disabled={isSubmitting}
                placeholder="e.g., Chinese Market, Bike Store"
                required
              />
            </FormFieldsContainer>

            {submitError && (
              <Alert severity="error" sx={{ borderRadius: '12px', mt: 2 }}>
                {submitError}
              </Alert>
            )}

            <ButtonContainer>
              <CancelButton
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </CancelButton>

              <SubmitButton
                type="submit"
                disabled={isSubmitting || isUploading}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? 'Creating...' : 'Create Shop'}
              </SubmitButton>
            </ButtonContainer>
          </form>
        </FormContent>
      </FormCard>
    </FormContainer>
  )
}

export default AddShopForm
