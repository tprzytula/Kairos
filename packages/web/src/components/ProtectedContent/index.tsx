import { Content } from '../../App.styled';
import ProtectedRoute from '../ProtectedRoute';
import AlertContainer from '../AlertContainer';
import PWAUpdateNotification from '../PWAUpdateNotification';
import ConnectivityNotification from '../ConnectivityNotification';
import { ShopProvider } from '../../providers/ShopProvider';
import { IProtectedContentProps } from './types';

const ProtectedContent = ({ children }: IProtectedContentProps) => {
  return (
    <Content>
      <ProtectedRoute>
        <ShopProvider>
          {children}
        </ShopProvider>
      </ProtectedRoute>
      <AlertContainer />
      <PWAUpdateNotification />
      <ConnectivityNotification />
    </Content>
  );
};

export default ProtectedContent;
