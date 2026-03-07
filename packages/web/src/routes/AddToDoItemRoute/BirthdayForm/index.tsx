import { useState, useCallback } from 'react'
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material'
import { useNavigate } from 'react-router'
import { Route } from '../../../enums/route'
import { useBirthdayContext } from '../../../providers/BirthdayProvider'

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
      navigate(Route.ToDoList)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save birthday')
    } finally {
      setIsLoading(false)
    }
  }, [name, month, day, birthYear, notes, addBirthdayItem, navigate])

  return (
    <Box sx={{ px: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        autoFocus
        fullWidth
        label="Person's name"
        value={name}
        onChange={e => setName(e.target.value)}
        disabled={isLoading}
        placeholder="e.g., Mom, John"
      />

      <TextField
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
      </TextField>

      <TextField
        fullWidth
        label="Day"
        type="number"
        value={day}
        onChange={e => setDay(e.target.value)}
        disabled={isLoading}
        inputProps={{ min: 1, max: 31 }}
        placeholder="e.g., 15"
      />

      <TextField
        fullWidth
        label="Birth year (optional)"
        type="number"
        value={birthYear}
        onChange={e => setBirthYear(e.target.value)}
        disabled={isLoading}
        placeholder="e.g., 1990"
        helperText="Used to calculate age"
      />

      <TextField
        fullWidth
        label="Notes (optional)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        disabled={isLoading}
        multiline
        rows={2}
        placeholder="Any notes about this person..."
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Button
        onClick={handleSubmit}
        variant="contained"
        disabled={isLoading || !name.trim() || !day}
        sx={{
          mt: 1,
          py: 1.5,
          background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
          '&:hover': { opacity: 0.9 },
          '&:disabled': { background: '#e5e7eb' },
        }}
      >
        {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Add Birthday'}
      </Button>
    </Box>
  )
}

export default BirthdayForm
