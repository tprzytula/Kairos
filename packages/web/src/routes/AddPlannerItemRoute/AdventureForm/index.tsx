import { useState, useCallback } from 'react'
import { useAppState } from '../../../providers/AppStateProvider'
import {
  Alert,
  CircularProgress,
  Stack,
  TextField,
  Button,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import ExploreIcon from '@mui/icons-material/Explore'
import { useNavigate } from 'react-router'
import { Route } from '../../../enums/route'
import { useAdventureContext } from '../../../providers/AdventureProvider'
import {
  FormContainer,
  FormCard,
  FormContent,
  FormFieldsContainer,
} from '../../../components/ItemForm/index.styled'
import dayjs from 'dayjs'

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

const AdventureForm = () => {
  const { addAdventure } = useAdventureContext()
  const { state: { selectedCalendarDate } } = useAppState()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [date, setDate] = useState(selectedCalendarDate ?? dayjs().format('YYYY-MM-DD'))
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const canSave = name.trim().length > 0 && date.length > 0

  const handleSubmit = useCallback(async () => {
    if (!canSave) return
    setError('')
    setIsLoading(true)
    try {
      await addAdventure({
        name: name.trim(),
        date,
        time: time.trim() || undefined,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
      })
      navigate(Route.Planner)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save adventure')
    } finally {
      setIsLoading(false)
    }
  }, [canSave, name, date, time, location, notes, addAdventure, navigate])

  return (
    <FormContainer>
      <AdventureFormCard>
        <FormContent>
          <Stack spacing={2.5}>
            <FormFieldsContainer>
              <AdventureTextField
                fullWidth
                label="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={isLoading}
                required
                autoFocus
                placeholder="e.g. Flight to Barcelona, Concert Night"
                onKeyDown={e => { if (e.key === 'Enter' && canSave) handleSubmit() }}
              />

              <AdventureTextField
                fullWidth
                label="Date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                disabled={isLoading}
                InputLabelProps={{ shrink: true }}
              />

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
                label="Location (optional)"
                value={location}
                onChange={e => setLocation(e.target.value)}
                disabled={isLoading}
                placeholder="e.g. Heathrow T5, O2 Arena"
              />

              <AdventureTextField
                fullWidth
                label="Notes (optional)"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                disabled={isLoading}
                multiline
                rows={3}
                placeholder="Booking refs, what to pack, things to look forward to..."
              />
            </FormFieldsContainer>

            <SubmitButton
              variant="contained"
              disabled={!canSave || isLoading}
              onClick={handleSubmit}
              fullWidth
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ExploreIcon />}
            >
              {isLoading ? 'Saving...' : 'Add Adventure'}
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
  )
}

export default AdventureForm
