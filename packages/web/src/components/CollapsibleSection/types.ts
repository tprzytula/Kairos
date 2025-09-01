import { ReactNode } from 'react'

export interface SectionIcon {
  emoji: string
  backgroundColor: string
  foregroundColor: string
}

export interface ICollapsibleSectionProps<T = any> {
  title: string
  icon: SectionIcon
  items: T[]
  children: ReactNode
  isExpanded?: boolean
  onToggleExpanded?: () => void
  expandTo?: boolean | null
  expandKey?: string | number
  headerRightContent?: ReactNode
}
