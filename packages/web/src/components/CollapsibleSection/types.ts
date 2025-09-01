import { ReactNode } from 'react'

export interface SectionIcon {
  emoji: string
  backgroundColor: string
  foregroundColor: string
}

export type SectionVariant = 'large' | 'small'

export interface ICollapsibleSectionProps<T = any> {
  title: string
  icon: SectionIcon
  items: T[]
  children: ReactNode
  variant?: SectionVariant
  isExpanded?: boolean
  onToggleExpanded?: () => void
  expandTo?: boolean | null
  expandKey?: string | number
  headerRightContent?: ReactNode
}
