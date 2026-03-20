import { Chip } from '@mui/material'

interface FilterChipProps {
  label: string
  isSelected: boolean
  onClick: () => void
}

const FilterChip = ({ label, isSelected, onClick }: FilterChipProps) => (
  <Chip
    label={label}
    size="small"
    variant={isSelected ? 'filled' : 'outlined'}
    onClick={onClick}
    sx={{
      borderRadius: '8px',
      flexShrink: 0,
      ...(isSelected
        ? { background: 'rgba(249,115,22,0.15)', color: '#ea580c', borderColor: 'rgba(249,115,22,0.3)', fontWeight: 600 }
        : { borderColor: 'rgba(0,0,0,0.12)', color: 'text.secondary' }),
    }}
  />
)

export default FilterChip
