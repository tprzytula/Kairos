import { FormControlLabel, Switch, Typography, Box } from '@mui/material'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { styled } from '@mui/material/styles'

interface PrivateToggleProps {
  isPrivate: boolean
  onChange: (isPrivate: boolean) => void
  disabled?: boolean
}

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: theme.palette.warning.main,
    '&:hover': {
      backgroundColor: 'rgba(237, 108, 2, 0.08)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: theme.palette.warning.main,
  },
}))

const PrivateToggle = ({ isPrivate, onChange, disabled }: PrivateToggleProps) => {
  return (
    <FormControlLabel
      control={
        <StyledSwitch
          checked={isPrivate}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          size="small"
        />
      }
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <VisibilityOffOutlinedIcon sx={{ fontSize: '1rem', color: isPrivate ? 'warning.main' : 'text.secondary' }} />
          <Typography
            variant="body2"
            sx={{
              color: isPrivate ? 'warning.main' : 'text.secondary',
              fontWeight: isPrivate ? 600 : 400,
              fontSize: '0.85rem',
            }}
          >
            Private
          </Typography>
        </Box>
      }
      sx={{ ml: 0 }}
    />
  )
}

export default PrivateToggle
