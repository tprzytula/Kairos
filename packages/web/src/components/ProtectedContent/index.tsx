import { Content } from '../../App.styled';
import ProtectedRoute from '../ProtectedRoute';
import AlertContainer from '../AlertContainer';
import PWAUpdateNotification from '../PWAUpdateNotification';
import ConnectivityNotification from '../ConnectivityNotification';
import { IProtectedContentProps } from './types';

const ProtectedContent = ({ children }: IProtectedContentProps) => {
  return (
    <Content>
      <ProtectedRoute>{children}</ProtectedRoute>
      <AlertContainer />
      <PWAUpdateNotification />
      <ConnectivityNotification />
    </Content>
  );
};

export default ProtectedContent;
