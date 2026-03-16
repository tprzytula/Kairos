import { ComponentType, ReactNode } from 'react'
import { styled } from '@mui/material/styles'
import CollapsibleSectionPlaceholder from '../CollapsibleSectionPlaceholder'

const PlaceholdersWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column'
})

interface GroupedListPlaceholderProps {
  ItemPlaceholder: ComponentType
  ariaLabel: string
  numberOfGroups: number
  itemsPerGroup?: (groupIndex: number) => number
  groupHeaderRightContent?: ReactNode
}

const GroupedListPlaceholder = ({
  ItemPlaceholder,
  ariaLabel,
  numberOfGroups,
  itemsPerGroup = (groupIndex) => 2 + groupIndex,
  groupHeaderRightContent,
}: GroupedListPlaceholderProps) => (
  <PlaceholdersWrapper aria-label={ariaLabel}>
    {Array.from({ length: numberOfGroups }).map((_, groupIndex) => (
      <CollapsibleSectionPlaceholder key={groupIndex} headerRightContent={groupHeaderRightContent}>
        {Array.from({ length: itemsPerGroup(groupIndex) }).map((_, itemIndex) => (
          <ItemPlaceholder key={itemIndex} />
        ))}
      </CollapsibleSectionPlaceholder>
    ))}
  </PlaceholdersWrapper>
)

export default GroupedListPlaceholder
