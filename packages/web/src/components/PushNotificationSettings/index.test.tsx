import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PushNotificationSettings from './index';
import { usePushNotifications } from '../../hooks/usePushNotifications';

jest.mock('../../hooks/usePushNotifications');

const mockUsePushNotifications = usePushNotifications as jest.MockedFunction<typeof usePushNotifications>;

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('PushNotificationSettings component', () => {
  const defaultMockReturn = {
    isSupported: true,
    permission: 'default' as NotificationPermission,
    isSubscribed: false,
    isLoading: false,
    error: null,
    requestPermission: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePushNotifications.mockReturnValue(defaultMockReturn);
  });

  describe('when push notifications are not supported', () => {
    it('should show not supported message', () => {
      mockUsePushNotifications.mockReturnValue({
        ...defaultMockReturn,
        isSupported: false,
      });

      renderWithTheme(<PushNotificationSettings />);

      expect(screen.getByText('Push notifications are not supported in this browser.')).toBeInTheDocument();
    });
  });

  describe('when push notifications are supported', () => {
    it('should render the component with default props', () => {
      renderWithTheme(<PushNotificationSettings />);
      expect(screen.getByText('Push Notifications')).toBeInTheDocument();
      expect(screen.getByText('Get notified when new todo items are added to your projects')).toBeInTheDocument();
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('should render with custom title and description', () => {
      const customTitle = 'Custom Title';
      const customDescription = 'Custom description';

      renderWithTheme(
        <PushNotificationSettings title={customTitle} description={customDescription} />
      );
      expect(screen.getByText(customTitle)).toBeInTheDocument();
      expect(screen.getByText(customDescription)).toBeInTheDocument();
    });

    it('should show notifications enabled status when subscribed', () => {
      mockUsePushNotifications.mockReturnValue({
        ...defaultMockReturn,
        permission: 'granted',
        isSubscribed: true,
      });

      renderWithTheme(<PushNotificationSettings />);

      expect(screen.getByText('Notifications enabled')).toBeInTheDocument();
      expect(screen.getByRole('switch')).toBeChecked();
    });

    it('should show blocked status when permission is denied', () => {
      mockUsePushNotifications.mockReturnValue({
        ...defaultMockReturn,
        permission: 'denied',
      });

      renderWithTheme(<PushNotificationSettings />);

      expect(screen.getByText('Notifications blocked by browser settings')).toBeInTheDocument();
      expect(screen.getByRole('switch')).toBeDisabled();
      expect(screen.getByText(/To enable notifications, please allow them/)).toBeInTheDocument();
    });

    it('should show loading state', () => {
      mockUsePushNotifications.mockReturnValue({
        ...defaultMockReturn,
        isLoading: true,
      });

      renderWithTheme(<PushNotificationSettings />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should show error message when there is an error', () => {
      const errorMessage = 'Test error message';
      mockUsePushNotifications.mockReturnValue({
        ...defaultMockReturn,
        error: errorMessage,
      });

      renderWithTheme(<PushNotificationSettings />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('when toggle switch is clicked', () => {
    it('should call subscribe when not subscribed', async () => {
      const mockSubscribe = jest.fn();
      mockUsePushNotifications.mockReturnValue({
        ...defaultMockReturn,
        permission: 'granted',
        isSubscribed: false,
        subscribe: mockSubscribe,
      });

      renderWithTheme(<PushNotificationSettings />);
      const toggle = screen.getByRole('switch');

      fireEvent.click(toggle);

      await waitFor(() => {
        expect(mockSubscribe).toHaveBeenCalledTimes(1);
      });
    });

    it('should call unsubscribe when subscribed', async () => {
      const mockUnsubscribe = jest.fn();
      mockUsePushNotifications.mockReturnValue({
        ...defaultMockReturn,
        permission: 'granted',
        isSubscribed: true,
        unsubscribe: mockUnsubscribe,
      });

      renderWithTheme(<PushNotificationSettings />);
      const toggle = screen.getByRole('switch');

      fireEvent.click(toggle);

      await waitFor(() => {
        expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
      });
    });

    it('should request permission before subscribing when permission not granted', async () => {
      const mockRequestPermission = jest.fn().mockResolvedValue(undefined);
      const mockSubscribe = jest.fn().mockResolvedValue(undefined);
      mockUsePushNotifications.mockReturnValue({
        ...defaultMockReturn,
        permission: 'default',
        isSubscribed: false,
        requestPermission: mockRequestPermission,
        subscribe: mockSubscribe,
      });

      renderWithTheme(<PushNotificationSettings />);
      const toggle = screen.getByRole('switch');

      fireEvent.click(toggle);

      await waitFor(() => {
        expect(mockRequestPermission).toHaveBeenCalledTimes(1);
        expect(mockSubscribe).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle errors gracefully', async () => {
      const mockSubscribe = jest.fn().mockRejectedValue(new Error('Test error'));
      mockUsePushNotifications.mockReturnValue({
        ...defaultMockReturn,
        permission: 'granted',
        isSubscribed: false,
        subscribe: mockSubscribe,
      });

      console.error = jest.fn();
      renderWithTheme(<PushNotificationSettings />);
      const toggle = screen.getByRole('switch');

      fireEvent.click(toggle);
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          'Error toggling push notifications:',
          expect.any(Error)
        );
      });
    });
  });
});
