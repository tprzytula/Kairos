import { UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts'

const getRedirectUri = (): string => {
  const origin = window.location.origin
  
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return `${origin}/auth/callback`
  }
  
  return "https://d1568c842iynon.cloudfront.net/auth/callback"
}

export const getPostLogoutRedirectUri = (): string => {
  const origin = window.location.origin
  
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return `${origin}/`
  }
  
  return "https://d1568c842iynon.cloudfront.net/"
}

export const oidcConfig: UserManagerSettings = {
  authority: 'https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_G0ND9mzC2',
  client_id: 'tr2fu38tohgm19h4lr6dqomc3',
  redirect_uri: getRedirectUri(),
  post_logout_redirect_uri: getPostLogoutRedirectUri(),
  response_type: 'code',
  scope: 'email openid profile offline_access',
  automaticSilentRenew: true,
  includeIdTokenInSilentRenew: true,
  loadUserInfo: true,
  
  revokeTokensOnSignout: false,
  
  silent_redirect_uri: `${window.location.origin}/silent-callback`,
  
  silentRequestTimeoutInSeconds: 10,
  
  accessTokenExpiringNotificationTimeInSeconds: 300,
  
  monitorSession: true,
  checkSessionIntervalInSeconds: 2,
  
  userStore: typeof window !== 'undefined' ? new WebStorageStateStore({ store: window.localStorage }) : undefined,
}
