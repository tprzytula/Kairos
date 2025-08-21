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

  if (!user) return null

  return (
    <>
      {isOpen && <Styled.DropdownOverlay onClick={closeDropdown} />}
      <div style={{ position: 'relative' }}>
        <Styled.UserButton onClick={toggleDropdown}>
          <Styled.UserAvatar 
            src={user.picture} 
            alt={user.name || 'User'}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          {!user.picture && (
            <div style={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              background: '#667eea', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </Styled.UserButton>
        
        {isOpen && (
          <Styled.UserDropdown>
            <Styled.UserInfo>
              <Styled.UserName>{user.name}</Styled.UserName>
              <Styled.UserEmail>{user.email}</Styled.UserEmail>
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
