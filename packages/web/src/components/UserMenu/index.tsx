import React, { useState } from 'react'
import { useAuth } from 'react-oidc-context'
import * as Styled from './index.styled'

const UserMenu: React.FC = () => {
  const auth = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    auth.signoutRedirect()
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const closeDropdown = () => {
    setIsOpen(false)
  }

  const user = auth.user?.profile
  const userName = user?.name || user?.given_name || 'User'
  const userEmail = user?.email || ''
  const userInitial = userName.charAt(0).toUpperCase() || 'U'

  // Only return null if there's absolutely no user at all
  if (!auth.user) return null

  return (
    <>
      {isOpen && <Styled.DropdownOverlay onClick={closeDropdown} />}
      <div style={{ position: 'relative' }}>
        <Styled.UserButton onClick={toggleDropdown}>
          {user?.picture ? (
            <Styled.UserAvatar 
              src={user.picture} 
              alt={userName}
              onError={(e) => {
                // Hide the failed image and show the fallback
                e.currentTarget.style.display = 'none'
                const fallback = e.currentTarget.nextElementSibling as HTMLElement
                if (fallback) fallback.style.display = 'flex'
              }}
            />
          ) : null}
          <div 
            style={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              background: '#667eea', 
              display: user?.picture ? 'none' : 'flex',
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {userInitial}
          </div>
        </Styled.UserButton>
        
        {isOpen && (
          <Styled.UserDropdown>
            <Styled.UserInfo>
              <Styled.UserName>{userName}</Styled.UserName>
              {userEmail && <Styled.UserEmail>{userEmail}</Styled.UserEmail>}
            </Styled.UserInfo>
            <Styled.LogoutButton onClick={handleLogout}>
              Sign Out
            </Styled.LogoutButton>
          </Styled.UserDropdown>
        )}
      </div>
    </>
  )
}

export default UserMenu
