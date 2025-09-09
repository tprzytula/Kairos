import { createFetchOptions } from '../../../utils/api';
import { API_BASE_URL } from '../../../api';
import { DeletePushSubscriptionResponse } from '../types';

export const deletePushSubscription = async (
  endpoint: string,
  accessToken: string
): Promise<DeletePushSubscriptionResponse> => {
  const encodedEndpoint = encodeURIComponent(endpoint);
  const response = await fetch(`${API_BASE_URL}/push-subscriptions?endpoint=${encodedEndpoint}`, createFetchOptions({
    method: 'DELETE',
  }, undefined, accessToken));

  if (response.ok) {
    return await response.json();
  }

  throw new Error('Failed to delete push subscription');
};
