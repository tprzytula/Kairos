import React from 'react'
import { SectionCardProps } from './types'
import { FullWidthSection, SectionCard as StyledSectionCard, SectionHeader, SectionContent, HeaderContent, StyledIcon, ItemCount } from './index.styled'

const SectionCard: React.FC<SectionCardProps> = ({ icon: Icon, title, count, children }) => {
  return (
    <FullWidthSection>
      <StyledSectionCard>
        <SectionContent>
          <SectionHeader>
            <HeaderContent>
              <StyledIcon>
                <Icon />
              </StyledIcon>
              {title}
            </HeaderContent>
            <ItemCount>{count}</ItemCount>
          </SectionHeader>
          {children}
        </SectionContent>
      </StyledSectionCard>
    </FullWidthSection>
  )
}

export default SectionCard
