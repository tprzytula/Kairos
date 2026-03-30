import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  Alert,
  CircularProgress,
  Stack,
  TextField,
  Button,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ExploreIcon from '@mui/icons-material/Explore'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { type Area } from 'react-easy-crop'
import { AlertColor } from '@mui/material'
import { Route } from '../../enums/route'
import { showAlert } from '../../utils/alert'
import StandardLayout from '../../layout/standardLayout'
import ModernPageHeader from '../../components/ModernPageHeader'
import { AdventureProvider, useAdventureContext } from '../../providers/AdventureProvider'
import { useAppState } from '../../providers/AppStateProvider'
import {
  FormContainer,
  FormCard,
  FormContent,
  FormFieldsContainer,
} from '../../components/ItemForm/index.styled'
import { ImageUploadBox, ImagePreview } from '../../components/FormCard/index.styled'
import ImageCropModal from '../../components/RecipeForm/ImageCropModal'
import { getCroppedBlob } from '../../components/RecipeForm/cropUtils'
import { getAdventureUploadUrl } from '../../api/adventures'
import { useProjectContext } from '../../providers/ProjectProvider'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/en-gb'
import PrivateToggle from '../../components/PrivateToggle'

const AdventureTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,253,255,0.95) 100%)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '& fieldset': {
      borderColor: 'rgba(6, 182, 212, 0.2)',
      borderWidth: '1px',
      transition: 'all 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(6, 182, 212, 0.4)',
      boxShadow: '0 2px 8px rgba(6, 182, 212, 0.1)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0891b2',
      borderWidth: '2px',
      boxShadow: '0 4px 16px rgba(6, 182, 212, 0.2)',
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: '500',
    '&.Mui-focused': {
      color: '#0891b2',
      fontWeight: '600',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '14px 16px',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
})

const SubmitButton = styled(Button)({
  background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  color: 'white',
  fontWeight: '600',
  fontSize: '1rem',
  padding: '0.875rem 2rem',
  borderRadius: '12px',
  textTransform: 'none',
  boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)',
  border: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  minHeight: '48px',
  '&:hover': {
    background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
    boxShadow: '0 6px 24px rgba(6, 182, 212, 0.4)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    background: 'linear-gradient(135deg, rgba(6,182,212,0.4) 0%, rgba(8,145,178,0.4) 100%)',
    color: 'rgba(255,255,255,0.6)',
    boxShadow: 'none',
    transform: 'none',
  },
})

const AdventureFormCard = styled(FormCard)({
  '&:before': {
    background: 'linear-gradient(90deg, #06b6d4 0%, #0891b2 50%, #67e8f9 100%)',
  },
})

const today = new Date()
const stats = [
  { value: today.toLocaleDateString('en-US', { weekday: 'short' }), label: 'Today' },
  { value: today.toLocaleDateString('en-US', { day: 'numeric' }), label: 'Day' },
  { value: today.toLocaleDateString('en-US', { month: 'short' }), label: 'Month' },
  { value: today.toLocaleDateString('en-US', { year: 'numeric' }), label: 'Year' },
]

const EditAdventureContent = () => {
  const { adventures, updateAdventure, isLoading: isAdventuresLoading } = useAdventureContext()
  const { dispatch } = useAppState()
  const { currentProject } = useProjectContext()
  const navigate = useNavigate()
  const { id } = useParams()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const adventure = useMemo(() => adventures.find(a => a.id === id) ?? null, [adventures, id])

  const [name, setName] = useState('')
  const [date, setDate] = useState<Dayjs | null>(null)
  const [endDate, setEndDate] = useState<Dayjs | null>(null)
  const [time, setTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imagePath, setImagePath] = useState<string | undefined>(undefined)
  const [isUploading, setIsUploading] = useState(false)
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [initialized, setInitialized] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)

  useEffect(() => {
    if (adventure && !initialized) {
      setName(adventure.name)
      setDate(dayjs(adventure.date))
      setEndDate(adventure.endDate ? dayjs(adventure.endDate) : null)
      setTime(adventure.time ?? '')
      setEndTime(adventure.endTime ?? '')
      setLocation(adventure.location ?? '')
      setNotes(adventure.notes ?? '')
      setImagePath(adventure.imagePath)
      setIsPrivate(adventure.visibility === 'private')
      setInitialized(true)
    } else if (!isAdventuresLoading && !adventure && adventures.length > 0) {
      showAlert({ description: 'Adventure not found', severity: 'error' }, dispatch)
      navigate(Route.Planner)
    }
  }, [adventure, adventures, isAdventuresLoading, initialized, dispatch, navigate])

  const canSave = name.trim().length > 0 && date !== null && date.isValid()

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

      const { uploadUrl, imagePath: path } = await getAdventureUploadUrl('jpg', currentProject?.id)
      await fetch(uploadUrl, {
        method: 'PUT',
        body: croppedBlob,
        headers: { 'Content-Type': 'image/jpeg' },
      })
      setImagePath(path)
    } catch {
      setError('Failed to upload image. Please try again.')
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

  const handleSubmit = useCallback(async () => {
    if (!canSave || !id) return
    setError('')
    setIsLoading(true)
    try {
      await updateAdventure(id, {
        name: name.trim(),
        date: date!.format('YYYY-MM-DD'),
        endDate: endDate?.isValid() ? endDate.format('YYYY-MM-DD') : null,
        time: time.trim() || null,
        endTime: endTime.trim() || null,
        location: location.trim() || null,
        notes: notes.trim() || null,
        imagePath: imagePath ?? null,
        isPrivate,
      })
      showAlert({ description: `${name.trim()} has been updated`, severity: 'success' }, dispatch)
      navigate(Route.Planner)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update adventure')
    } finally {
      setIsLoading(false)
    }
  }, [canSave, id, name, date, endDate, time, endTime, location, notes, imagePath, isPrivate, updateAdventure, dispatch, navigate])

  const displayImageUrl = previewUrl ?? (adventure?.imagePath ? adventure.imagePath : null)

  if (!initialized) {
    return (
      <StandardLayout centerVertically>
        <div>Loading...</div>
      </StandardLayout>
    )
  }

  return (
    <StandardLayout>
      <ModernPageHeader
        title="Edit Adventure"
        icon={<ExploreIcon />}
        stats={stats}
      />

      <FormContainer>
        {pendingImageSrc && (
          <ImageCropModal
            imageSrc={pendingImageSrc}
            onConfirm={handleCropConfirm}
            onCancel={handleCropCancel}
            aspect={16 / 9}
          />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <AdventureFormCard>
          <FormContent>
            <Stack spacing={2.5}>
              <ImageUploadBox onClick={handleImageClick} aria-label="Upload adventure photo">
                {displayImageUrl ? (
                  <ImagePreview src={displayImageUrl} alt="Adventure photo preview" />
                ) : null}
                {isUploading ? (
                  <CircularProgress size={24} sx={{ position: 'relative', zIndex: 1 }} />
                ) : !displayImageUrl ? (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AddPhotoAlternateIcon fontSize="small" />
                    Add photo (optional)
                  </Typography>
                ) : null}
              </ImageUploadBox>

              <FormFieldsContainer>
                <AdventureTextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={isLoading}
                  required
                  autoFocus
                />

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                  <DatePicker
                    label="Date"
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                    disabled={isLoading}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,253,255,0.95) 100%)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '& fieldset': { borderColor: 'rgba(6, 182, 212, 0.2)', borderWidth: '1px' },
                            '&:hover fieldset': { borderColor: 'rgba(6, 182, 212, 0.4)', boxShadow: '0 2px 8px rgba(6, 182, 212, 0.1)' },
                            '&.Mui-focused fieldset': { borderColor: '#0891b2', borderWidth: '2px', boxShadow: '0 4px 16px rgba(6, 182, 212, 0.2)' },
                          },
                          '& .MuiInputLabel-root.Mui-focused': { color: '#0891b2', fontWeight: '600' },
                          '& .MuiOutlinedInput-input': { padding: '14px 16px', fontSize: '0.95rem', fontWeight: '500' },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                  <DatePicker
                    label="End date (optional)"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    disabled={isLoading}
                    format="DD/MM/YYYY"
                    minDate={date ?? undefined}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,253,255,0.95) 100%)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '& fieldset': { borderColor: 'rgba(6, 182, 212, 0.2)', borderWidth: '1px' },
                            '&:hover fieldset': { borderColor: 'rgba(6, 182, 212, 0.4)', boxShadow: '0 2px 8px rgba(6, 182, 212, 0.1)' },
                            '&.Mui-focused fieldset': { borderColor: '#0891b2', borderWidth: '2px', boxShadow: '0 4px 16px rgba(6, 182, 212, 0.2)' },
                          },
                          '& .MuiInputLabel-root.Mui-focused': { color: '#0891b2', fontWeight: '600' },
                          '& .MuiOutlinedInput-input': { padding: '14px 16px', fontSize: '0.95rem', fontWeight: '500' },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>

                <AdventureTextField
                  fullWidth
                  label="Time (optional)"
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  disabled={isLoading}
                  InputLabelProps={{ shrink: true }}
                />

                <AdventureTextField
                  fullWidth
                  label="End time (optional)"
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  disabled={isLoading}
                  InputLabelProps={{ shrink: true }}
                />

                <AdventureTextField
                  fullWidth
                  label="Location (optional)"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  disabled={isLoading}
                />

                <AdventureTextField
                  fullWidth
                  label="Notes (optional)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  disabled={isLoading}
                  multiline
                  rows={3}
                />
              </FormFieldsContainer>

              <PrivateToggle isPrivate={isPrivate} onChange={setIsPrivate} disabled={isLoading} />

              <SubmitButton
                variant="contained"
                disabled={!canSave || isLoading || isUploading}
                onClick={handleSubmit}
                fullWidth
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ExploreIcon />}
              >
                {isLoading ? 'Saving...' : 'Update Adventure'}
              </SubmitButton>

              {error && (
                <Alert severity="error" sx={{ borderRadius: '12px' }}>
                  {error}
                </Alert>
              )}
            </Stack>
          </FormContent>
        </AdventureFormCard>
      </FormContainer>
    </StandardLayout>
  )
}

export const EditAdventureRoute = () => {
  return (
    <AdventureProvider>
      <EditAdventureContent />
    </AdventureProvider>
  )
}

export default EditAdventureRoute
