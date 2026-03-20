import { ReactElement, ReactNode } from 'react';

export interface EmptyStateProps {
  icon?: ReactElement;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
}
