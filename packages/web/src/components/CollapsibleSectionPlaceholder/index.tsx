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
import { SectionVariant } from '../CollapsibleSection/types';

interface CollapsibleSectionPlaceholderProps {
  variant?: SectionVariant;
  headerRightContent?: ReactNode;
  children?: ReactNode;
}

const CollapsibleSectionPlaceholder = ({ 
  variant = 'large', 
  headerRightContent,
  children
}: CollapsibleSectionPlaceholderProps) => (
  <SectionWrapper sectionVariant={variant}>
    <SectionHeaderPlaceholder sectionVariant={variant}>
      <SectionLeftContainer>
        <SectionIconPlaceholder sectionVariant={variant} />
        <SectionTitlePlaceholder sectionVariant={variant} />
      </SectionLeftContainer>
      <SectionRightContainer>
        <SectionCountPlaceholder sectionVariant={variant} />
        {headerRightContent}
        <ChevronPlaceholder sectionVariant={variant} />
      </SectionRightContainer>
    </SectionHeaderPlaceholder>
    {children}
  </SectionWrapper>
);

export default CollapsibleSectionPlaceholder;
