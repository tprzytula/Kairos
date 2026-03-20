import { EmptyStateContainer, EmptyStateText } from './index.styled';
import { EmptyStateProps } from './types';

export const EmptyState = ({ icon, title, subtitle, children }: EmptyStateProps) => {
  if (children) {
    return <EmptyStateContainer>{children}</EmptyStateContainer>;
  }

  return (
    <EmptyStateContainer>
      {icon}
      <EmptyStateText>{title}</EmptyStateText>
      <EmptyStateText>{subtitle}</EmptyStateText>
    </EmptyStateContainer>
  );
};

export default EmptyState;
