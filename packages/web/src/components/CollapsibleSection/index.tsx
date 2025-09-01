import { useState, useCallback, useEffect } from 'react'
import { Box, Collapse, IconButton } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { ICollapsibleSectionProps } from './types'
import {
  SectionWrapper,
  SectionHeader,
  SectionTitle,
  ItemCountChip,
  SectionContent,
  SectionIconCircle,
  ChevronBox,
} from './index.styled'

export const CollapsibleSection = <T,>({
  title,
  icon,
  items,
  children,
  isExpanded: controlledExpanded,
  onToggleExpanded,
  expandTo,
  expandKey,
  headerRightContent,
}: ICollapsibleSectionProps<T>) => {
  const [internalExpanded, setInternalExpanded] = useState(true)
  
  const isControlled = controlledExpanded !== undefined && onToggleExpanded !== undefined
  const isExpanded = isControlled ? controlledExpanded : internalExpanded

  useEffect(() => {
    if (expandTo !== null && expandTo !== undefined) {
      if (!isControlled) {
        setInternalExpanded(expandTo)
      }
    }
  }, [expandKey, expandTo, isControlled])

  const handleToggleExpanded = useCallback(() => {
    if (isControlled) {
      onToggleExpanded?.()
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }, [isControlled, internalExpanded, onToggleExpanded])

  if (items.length === 0) {
    return null
  }

  return (
    <SectionWrapper>
      <SectionHeader onClick={handleToggleExpanded}>
        <Box display="flex" alignItems="center" gap={1.25}>
          <SectionIconCircle
            bg={icon.backgroundColor}
            fg={icon.foregroundColor}
          >
            {icon.emoji}
          </SectionIconCircle>
          <SectionTitle>{title}</SectionTitle>
        </Box>
        <Box display="flex" alignItems="center" gap={0.75}>
          <ItemCountChip label={items.length} size="small" />
          {headerRightContent}
          <IconButton size="small" aria-label={isExpanded ? 'Collapse' : 'Expand'} onClick={handleToggleExpanded}>
            <ChevronBox expanded={isExpanded}>
              <ExpandMoreIcon />
            </ChevronBox>
          </IconButton>
        </Box>
      </SectionHeader>

      <Collapse in={isExpanded} timeout={120}>
        <SectionContent>
          {children}
        </SectionContent>
      </Collapse>
    </SectionWrapper>
  )
}

export default CollapsibleSection
