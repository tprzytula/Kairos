import { ReactNode } from 'react';
import {
  SectionWrapper,
  SectionHeaderPlaceholder,
  SectionLeftContainer,
  SectionRightContainer,
  SectionIconPlaceholder,
  SectionTitlePlaceholder,
  SectionCountPlaceholder,
  ChevronPlaceholder,
} from './index.styled';

interface CollapsibleSectionPlaceholderProps {
  headerRightContent?: ReactNode;
  children?: ReactNode;
}

const CollapsibleSectionPlaceholder = ({ 
  headerRightContent,
  children
}: CollapsibleSectionPlaceholderProps) => (
  <SectionWrapper>
    <SectionHeaderPlaceholder>
      <SectionLeftContainer>
        <SectionIconPlaceholder />
        <SectionTitlePlaceholder />
      </SectionLeftContainer>
      <SectionRightContainer>
        <SectionCountPlaceholder />
        {headerRightContent}
        <ChevronPlaceholder />
      </SectionRightContainer>
    </SectionHeaderPlaceholder>
    {children}
  </SectionWrapper>
);

export default CollapsibleSectionPlaceholder;
