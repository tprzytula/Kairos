import { ReactNode } from 'react'
import { SvgIconComponent } from '@mui/icons-material'

export interface SectionCardProps {
  icon: SvgIconComponent
  title: string
  count: number
  children: ReactNode
}
