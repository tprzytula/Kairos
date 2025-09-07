import { useState, useCallback } from 'react'
import { Alert, CircularProgress } from '@mui/material'
import StorefrontIcon from '@mui/icons-material/Storefront'
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
  IconPreview,
} from './index.styled'

const AddShopForm = ({ onSubmit, onCancel, isSubmitting = false }: IAddShopFormProps) => {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [nameError, setNameError] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setName(value)
    if (nameError) {
      setNameError('')
    }
  }, [nameError])

  const handleIconChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIcon(event.target.value)
  }, [])

  const validateForm = useCallback(() => {
    let isValid = true

    if (!name.trim()) {
      setNameError('Shop name is required')
      isValid = false
    } else if (name.trim().length < 2) {
      setNameError('Shop name must be at least 2 characters')
      isValid = false
    }

    return isValid
  }, [name])

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(name.trim(), icon.trim() || undefined)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Failed to create shop. Please try again.'
      )
    }
  }, [name, icon, validateForm, onSubmit])

  return (
    <FormContainer>
      <FormCard>
        <FormContent>
          <IconPreview>
            {icon ? (
              <img 
                src={icon} 
                alt="Shop icon preview" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  borderRadius: '8px'
                }} 
                onError={() => {
                  // Fallback to default icon if image fails to load
                  setIcon('')
                }}
              />
            ) : (
              <StorefrontIcon fontSize="inherit" />
            )}
          </IconPreview>
          
          <form onSubmit={handleSubmit} noValidate>
            <FormFieldsContainer>
              <StyledTextField
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
              
              <StyledTextField
                fullWidth
                label="Shop Icon URL (optional)"
                value={icon}
                onChange={handleIconChange}
                disabled={isSubmitting}
                placeholder="https://example.com/icon.png"
                type="url"
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
                disabled={isSubmitting}
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
