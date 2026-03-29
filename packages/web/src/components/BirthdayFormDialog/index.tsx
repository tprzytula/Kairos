import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Box,
  MenuItem,
} from '@mui/material'
import CakeIcon from '@mui/icons-material/Cake'
import { IBirthdayItem } from '../../api/birthdays/retrieve/types'
import { useBirthdayContext } from '../../providers/BirthdayProvider'
import PrivateToggle from '../PrivateToggle'

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

interface BirthdayFormDialogProps {
  open: boolean
  onClose: () => void
  initialBirthday?: IBirthdayItem | null
}

const BirthdayFormDialog: React.FC<BirthdayFormDialogProps> = ({ open, onClose, initialBirthday }) => {
  const { addBirthdayItem, updateBirthdayItem } = useBirthdayContext()
  const [name, setName] = useState('')
  const [month, setMonth] = useState<number>(1)
  const [day, setDay] = useState<string>('')
  const [birthYear, setBirthYear] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)

  const isEditing = initialBirthday != null

  useEffect(() => {
    if (open) {
      if (initialBirthday) {
        setName(initialBirthday.name)
        setMonth(initialBirthday.month)
        setDay(String(initialBirthday.day))
        setBirthYear(initialBirthday.birthYear != null ? String(initialBirthday.birthYear) : '')
        setNotes(initialBirthday.notes ?? '')
        setIsPrivate(initialBirthday.visibility === 'private')
      } else {
        setName('')
        setMonth(1)
        setDay('')
        setBirthYear('')
        setNotes('')
        setIsPrivate(false)
      }
      setError('')
    }
  }, [open, initialBirthday])

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

  const handleSubmit = async () => {
    if (!validate()) return

    setIsLoading(true)
    try {
      const fields = {
        name: name.trim(),
        month,
        day: parseInt(day),
        ...(birthYear ? { birthYear: parseInt(birthYear) } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
        isPrivate,
      }

      if (isEditing && initialBirthday) {
        await updateBirthdayItem(initialBirthday.id, fields)
      } else {
        await addBirthdayItem(fields)
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save birthday')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) handleSubmit()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CakeIcon sx={{ color: '#db2777' }} />
          <Typography variant="h6">
            {isEditing ? 'Edit Birthday' : 'Add Birthday'}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            autoFocus
            fullWidth
            label="Person's name"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            placeholder="e.g., Mom, John"
          />

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              select
              label="Month"
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              disabled={isLoading}
              sx={{ flex: 2 }}
            >
              {MONTHS.map(m => (
                <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Day"
              type="number"
              value={day}
              onChange={e => setDay(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              inputProps={{ min: 1, max: 31 }}
              placeholder="e.g., 15"
              sx={{ flex: 1 }}
            />
          </Box>

          <TextField
            fullWidth
            label="Birth year (optional)"
            type="number"
            value={birthYear}
            onChange={e => setBirthYear(e.target.value)}
            onKeyDown={handleKeyPress}
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

          <PrivateToggle isPrivate={isPrivate} onChange={setIsPrivate} disabled={isLoading} />

          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || !name.trim() || !day}
          sx={{
            minWidth: 100,
            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            '&:hover': { opacity: 0.9 },
          }}
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : (isEditing ? 'Save' : 'Add Birthday')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BirthdayFormDialog
