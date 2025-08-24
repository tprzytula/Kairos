import { useState, useCallback, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { savePushSubscription, deletePushSubscription } from '../../api/pushSubscriptions';

export interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission | null;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<void>;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

const VAPID_PUBLIC_KEY = process.env.REACT_APP_VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa40HI-4MuU9wSZVAQ';

export const usePushNotifications = (): UsePushNotificationsReturn => {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

  const checkSubscriptionStatus = useCallback(async () => {
    if (!isSupported || !user?.access_token) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  }, [isSupported, user?.access_token]);

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    setPermission(Notification.permission);
    
    checkSubscriptionStatus();
  }, [isSupported, checkSubscriptionStatus]);

  const requestPermission = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      throw new Error('Push notifications are not supported');
    }

    setIsLoading(true);
    setError(null);

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission !== 'granted') {
        throw new Error('Permission denied for notifications');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request permission';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const subscribe = useCallback(async (): Promise<void> => {
    if (!isSupported || !user?.access_token) {
      throw new Error('Push notifications are not supported or user not authenticated');
    }

    if (permission !== 'granted') {
      throw new Error('Permission not granted for notifications');
    }

    setIsLoading(true);
    setError(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        setIsSubscribed(true);
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });

      const subscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(subscription.getKey('auth')!),
        },
      };

      await savePushSubscription(subscriptionData, user.access_token);
      setIsSubscribed(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to subscribe to notifications';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, user?.access_token, permission]);

  const unsubscribe = useCallback(async (): Promise<void> => {
    if (!isSupported || !user?.access_token) {
      throw new Error('Push notifications are not supported or user not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        setIsSubscribed(false);
        return;
      }

      await subscription.unsubscribe();

      await deletePushSubscription(subscription.endpoint, user.access_token);
      setIsSubscribed(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unsubscribe from notifications';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, user?.access_token]);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    requestPermission,
    subscribe,
    unsubscribe,
  };
};

function urlB64ToUint8Array(base64String: string): ArrayBufferView {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
