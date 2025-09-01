import { ReactNode } from 'react';
import { SectionVariant } from '../CollapsibleSection/types';

export interface ICollapsibleSectionPlaceholderProps {
  variant?: SectionVariant;
  headerRightContent?: ReactNode;
  children?: ReactNode;
}
