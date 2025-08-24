import { createFetchOptions } from '../../../utils/api';
import { PushSubscriptionData } from '../types';
import { API_BASE_URL } from '../../../api';

interface SavePushSubscriptionResponse {
  success: boolean;
}

export const savePushSubscription = async (
  subscriptionData: PushSubscriptionData,
  accessToken: string
): Promise<SavePushSubscriptionResponse> => {
  const response = await fetch(`${API_BASE_URL}/push-subscriptions`, createFetchOptions({
    method: 'POST',
    body: JSON.stringify(subscriptionData),
  }, undefined, accessToken));

  if (response.ok) {
    return await response.json();
  }

  throw new Error('Failed to save push subscription');
};
