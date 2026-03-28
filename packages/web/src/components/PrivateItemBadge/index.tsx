import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Tooltip } from '@mui/material'

const PrivateItemBadge = () => {
  return (
    <Tooltip title="Private item - only visible to you" arrow>
      <LockOutlinedIcon sx={{ fontSize: '0.875rem', color: 'warning.main', flexShrink: 0 }} />
    </Tooltip>
  )
}

export default PrivateItemBadge
