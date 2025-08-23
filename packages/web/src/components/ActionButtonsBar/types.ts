import { ReactNode } from 'react'

export interface IExpandCollapseButtonProps {
  isExpanded: boolean
  onToggle: () => void
  disabled?: boolean
}

export interface IActionButtonProps {
  isEnabled: boolean
  onClick: () => void
  children: ReactNode
  statusText?: string
  disabled?: boolean
}

export interface IViewToggleButtonProps {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
}

export interface IActionButtonsBarProps {
  expandCollapseButton?: IExpandCollapseButtonProps
  actionButton?: IActionButtonProps
  viewToggleButton?: IViewToggleButtonProps
}
