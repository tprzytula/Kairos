import { UserManagerSettings } from 'oidc-client-ts'

const getRedirectUri = (): string => {
  const origin = window.location.origin
  
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return `${origin}/callback`
  }
  
  return "https://d1568c842iynon.cloudfront.net/callback"
}

export const oidcConfig: UserManagerSettings = {
  authority: 'https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_G0ND9mzC2',
  client_id: 'tr2fu38tohgm19h4lr6dqomc3',
  redirect_uri: getRedirectUri(),
  post_logout_redirect_uri: window.location.origin,
  response_type: 'code',
  scope: 'email openid profile',
  automaticSilentRenew: true,
  includeIdTokenInSilentRenew: true,
  loadUserInfo: true,
  
  revokeTokensOnSignout: true,
  
  silent_redirect_uri: `${window.location.origin}/auth/silent-callback`,
}
