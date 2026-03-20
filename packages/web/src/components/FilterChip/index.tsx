import { styled } from '@mui/material/styles'

interface FilterChipProps {
  label: string
  isSelected: boolean
  onClick: () => void
}

const ChipButton = styled('button')<{ selected: boolean }>(({ selected }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.25rem 0.75rem',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  flexShrink: 0,
  fontSize: '0.8125rem',
  fontFamily: 'inherit',
  lineHeight: 1.5,
  transition: 'all 0.15s ease',
  ...(selected
    ? {
        background: 'rgba(249,115,22,0.15)',
        color: '#ea580c',
        fontWeight: 600,
      }
    : {
        background: 'rgba(0, 0, 0, 0.05)',
        color: 'rgba(0, 0, 0, 0.6)',
        fontWeight: 400,
      }),
}))

const FilterChip = ({ label, isSelected, onClick }: FilterChipProps) => (
  <ChipButton selected={isSelected} onClick={onClick}>
    {label}
  </ChipButton>
)

export default FilterChip
