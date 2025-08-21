import React from 'react'

const SilentCallback: React.FC = () => {
  // react-oidc-context handles silent callbacks automatically
  // This component is just for the redirect URI
  return <div>Silent authentication in progress...</div>
}

export default SilentCallback
