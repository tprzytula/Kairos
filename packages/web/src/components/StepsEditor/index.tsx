import { useCallback } from 'react'
import { Box, IconButton, InputBase, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { IStep } from '../../api/toDoList/retrieve/types'

interface StepsEditorProps {
  steps: IStep[]
  onChange: (steps: IStep[]) => void
  embedded?: boolean
}

const StepsEditor = ({ steps, onChange, embedded = false }: StepsEditorProps) => {
  const addStep = useCallback(() => {
    onChange([...steps, { id: crypto.randomUUID(), name: '', isDone: false }])
  }, [steps, onChange])

  const removeStep = useCallback((id: string) => {
    onChange(steps.filter(s => s.id !== id))
  }, [steps, onChange])

  const updateStepName = useCallback((id: string, name: string) => {
    onChange(steps.map(s => s.id === id ? { ...s, name } : s))
  }, [steps, onChange])

  if (embedded) {
    return (
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary', letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.75rem' }}
        >
          Sub-steps
        </Typography>

        {steps.map((step, index) => (
          <Box
            key={step.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1,
              borderRadius: '10px',
              border: '1.5px solid',
              borderColor: 'rgba(102, 126, 234, 0.25)',
              px: 1.5,
              py: 0.5,
              background: 'rgba(102, 126, 234, 0.04)',
            }}
          >
            <Typography sx={{ color: 'text.disabled', fontSize: '0.85rem', minWidth: 20, textAlign: 'center' }}>
              {index + 1}.
            </Typography>
            <InputBase
              value={step.name}
              onChange={e => updateStepName(step.id, e.target.value)}
              placeholder="Step name"
              fullWidth
              inputProps={{ 'aria-label': `Sub-step ${index + 1} name` }}
              sx={{ fontSize: '0.9375rem' }}
            />
            <IconButton
              size="small"
              onClick={() => removeStep(step.id)}
              aria-label={`Remove step ${index + 1}`}
              sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={addStep}
          size="small"
          sx={{
            mt: steps.length > 0 ? 1 : 0,
            textTransform: 'none',
            fontWeight: 600,
            color: '#667eea',
            borderRadius: '8px',
            px: 1.5,
            '&:hover': { background: 'rgba(102, 126, 234, 0.08)' },
          }}
        >
          Add step
        </Button>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
        margin: '0 0 2rem 0',
        padding: '2rem 1.25rem',
        boxSizing: 'border-box',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          opacity: 0.8,
        },
        '@media (max-width: 600px)': {
          padding: '1.5rem 1rem',
        },
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary', letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.75rem' }}
      >
        Sub-steps
      </Typography>

      {steps.map((step, index) => (
        <Box
          key={step.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1,
            borderRadius: '10px',
            border: '1.5px solid',
            borderColor: 'rgba(102, 126, 234, 0.25)',
            px: 1.5,
            py: 0.5,
            background: 'rgba(102, 126, 234, 0.04)',
          }}
        >
          <Typography sx={{ color: 'text.disabled', fontSize: '0.85rem', minWidth: 20, textAlign: 'center' }}>
            {index + 1}.
          </Typography>
          <InputBase
            value={step.name}
            onChange={e => updateStepName(step.id, e.target.value)}
            placeholder="Step name"
            fullWidth
            inputProps={{ 'aria-label': `Sub-step ${index + 1} name` }}
            sx={{ fontSize: '0.9375rem' }}
          />
          <IconButton
            size="small"
            onClick={() => removeStep(step.id)}
            aria-label={`Remove step ${index + 1}`}
            sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={addStep}
        size="small"
        sx={{
          mt: steps.length > 0 ? 1 : 0,
          textTransform: 'none',
          fontWeight: 600,
          color: '#667eea',
          borderRadius: '8px',
          px: 1.5,
          '&:hover': { background: 'rgba(102, 126, 234, 0.08)' },
        }}
      >
        Add step
      </Button>
    </Box>
  )
}

export default StepsEditor
