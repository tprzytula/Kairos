import React from 'react'
import { SectionCardProps } from './types'
import { FullWidthSection, SectionCard as StyledSectionCard, SectionHeader, SectionContent, HeaderContent, StyledIcon, ItemCount } from './index.styled'

const SectionCard: React.FC<SectionCardProps> = ({ icon: Icon, title, count, children, accentGradient, accentBadgeColor, onHeaderClick }) => {
  return (
    <FullWidthSection>
      <StyledSectionCard accentGradient={accentGradient}>
        <SectionContent>
          <SectionHeader onClick={onHeaderClick} style={onHeaderClick ? { cursor: 'pointer' } : undefined}>
            <HeaderContent>
              <StyledIcon accentGradient={accentGradient}>
                <Icon />
              </StyledIcon>
              {title}
            </HeaderContent>
            <ItemCount accentBadgeColor={accentBadgeColor}>{count}</ItemCount>
          </SectionHeader>
          {children}
        </SectionContent>
      </StyledSectionCard>
    </FullWidthSection>
  )
}

export default SectionCard
