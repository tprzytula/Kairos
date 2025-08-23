import { EmptyStateContainer, EmptyStateText } from './index.styled';
import { EmptyStateProps } from './types';

export const EmptyState = ({ icon, title, subtitle }: EmptyStateProps) => (
  <EmptyStateContainer>
    {icon}
    <EmptyStateText>{title}</EmptyStateText>
    <EmptyStateText>{subtitle}</EmptyStateText>
  </EmptyStateContainer>
);

export default EmptyState;
