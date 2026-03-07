import { useState, useCallback } from 'react'
import { MenuItem, Alert, CircularProgress, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Button, TextField } from '@mui/material'
import { useNavigate } from 'react-router'
import { Route } from '../../../enums/route'
import { useBirthdayContext } from '../../../providers/BirthdayProvider'
import {
  FormContainer,
  FormCard,
  FormContent,
  FormFieldsContainer,
} from '../../../components/ItemForm/index.styled'

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

const BirthdayTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '& fieldset': {
      borderColor: 'rgba(236, 72, 153, 0.2)',
      borderWidth: '1px',
      transition: 'all 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(236, 72, 153, 0.4)',
      boxShadow: '0 2px 8px rgba(236, 72, 153, 0.1)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ec4899',
      borderWidth: '2px',
      boxShadow: '0 4px 16px rgba(236, 72, 153, 0.2)',
    },
    '&.Mui-error fieldset': {
      borderColor: theme.palette.error.main,
    },
    '&.Mui-disabled': {
      background: 'rgba(248, 250, 252, 0.5)',
      opacity: 0.7,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    fontWeight: '500',
    '&.Mui-focused': {
      color: '#ec4899',
      fontWeight: '600',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '14px 16px',
    fontSize: '0.95rem',
    fontWeight: '500',
    color: theme.palette.text.primary,
  },
  '& .MuiFormHelperText-root': {
    fontSize: '0.8rem',
    fontWeight: '500',
    marginLeft: '4px',
    marginTop: '6px',
  },
}))

const SubmitButton = styled(Button)({
  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
  color: 'white',
  fontWeight: '600',
  fontSize: '1rem',
  padding: '0.875rem 2rem',
  borderRadius: '12px',
  textTransform: 'none',
  boxShadow: '0 4px 16px rgba(219, 39, 119, 0.3)',
  border: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  minHeight: '48px',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
    boxShadow: '0 6px 24px rgba(219, 39, 119, 0.4)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    background: 'linear-gradient(135deg, rgba(236,72,153,0.4) 0%, rgba(219,39,119,0.4) 100%)',
    color: 'rgba(255,255,255,0.6)',
    boxShadow: 'none',
    transform: 'none',
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover:before': {
    left: '100%',
  },
})

const BirthdayFormCard = styled(FormCard)({
  '&:before': {
    background: 'linear-gradient(90deg, #ec4899 0%, #db2777 50%, #f472b6 100%)',
  },
})

const BirthdayForm = () => {
  const { addBirthdayItem } = useBirthdayContext()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [month, setMonth] = useState<number>(1)
  const [day, setDay] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const validate = (): boolean => {
    setError('')
    if (!name.trim()) {
      setError('Name is required')
      return false
    }
    const dayNum = parseInt(day)
    if (!day || isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      setError('Please enter a valid day (1–31)')
      return false
    }
    if (birthYear) {
      const yearNum = parseInt(birthYear)
      const currentYear = new Date().getFullYear()
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) {
        setError(`Birth year must be between 1900 and ${currentYear}`)
        return false
      }
    }
    return true
  }

  const handleSubmit = useCallback(async () => {
    if (!validate()) return
    setIsLoading(true)
    try {
      await addBirthdayItem({
        name: name.trim(),
        month,
        day: parseInt(day),
        ...(birthYear ? { birthYear: parseInt(birthYear) } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      })
      navigate(Route.Planner)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save birthday')
    } finally {
      setIsLoading(false)
    }
  }, [name, month, day, birthYear, notes, addBirthdayItem, navigate])

  return (
    <FormContainer>
      <BirthdayFormCard>
        <FormContent>
          <form
            onSubmit={e => { e.preventDefault(); handleSubmit() }}
            noValidate
          >
            <Stack spacing={2.5}>
              <FormFieldsContainer>
                <BirthdayTextField
                  autoFocus
                  fullWidth
                  label="Person's name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g., Mom, John"
                />

                <BirthdayTextField
                  select
                  fullWidth
                  label="Month"
                  value={month}
                  onChange={e => setMonth(Number(e.target.value))}
                  disabled={isLoading}
                >
                  {MONTHS.map(m => (
                    <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                  ))}
                </BirthdayTextField>

                <BirthdayTextField
                  fullWidth
                  label="Day"
                  type="number"
                  value={day}
                  onChange={e => setDay(e.target.value)}
                  disabled={isLoading}
                  inputProps={{ min: 1, max: 31 }}
                  placeholder="1 – 31"
                />

                <BirthdayTextField
                  fullWidth
                  label="Birth year (optional)"
                  type="number"
                  value={birthYear}
                  onChange={e => setBirthYear(e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g., 1990"
                  helperText="Used to calculate age"
                />

                <BirthdayTextField
                  fullWidth
                  label="Notes (optional)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  disabled={isLoading}
                  multiline
                  rows={2}
                  placeholder="Any notes about this person..."
                />
              </FormFieldsContainer>

              <SubmitButton
                type="submit"
                variant="contained"
                disabled={isLoading || !name.trim() || !day}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                fullWidth
              >
                {isLoading ? 'Saving...' : 'Add Birthday'}
              </SubmitButton>

              {error && (
                <Alert severity="error" sx={{ borderRadius: '12px' }}>
                  {error}
                </Alert>
              )}
            </Stack>
          </form>
        </FormContent>
      </BirthdayFormCard>
    </FormContainer>
  )
}

export default BirthdayForm
