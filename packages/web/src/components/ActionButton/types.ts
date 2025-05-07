import { SxProps } from "@mui/material"

export interface IActionButtonProps {
  ariaLabel: string
  icon?: React.ReactNode
  onClick: () => void
  text?: string
  sx?: SxProps
}
