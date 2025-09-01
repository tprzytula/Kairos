import { Content } from '../../App.styled';
import ProtectedRoute from '../ProtectedRoute';
import AlertContainer from '../AlertContainer';
import PWAUpdateNotification from '../PWAUpdateNotification';
import ConnectivityNotification from '../ConnectivityNotification';
import { IProtectedAppRouteProps } from './types';

const ProtectedAppRoute = ({ children }: IProtectedAppRouteProps) => {
  return (
    <Content>
      <ProtectedRoute>{children}</ProtectedRoute>
      <AlertContainer />
      <PWAUpdateNotification />
      <ConnectivityNotification />
    </Content>
  );
};

export default ProtectedAppRoute;
