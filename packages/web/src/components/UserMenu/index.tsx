import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from 'react-oidc-context'
import * as Styled from './index.styled'
import { getPostLogoutRedirectUri, oidcConfig } from '../../config/oidc'

const UserMenu: React.FC = () => {
  const auth = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleLogout = () => {
    const clientId = oidcConfig.client_id;
    const logoutUri = getPostLogoutRedirectUri();
    const cognitoDomain = "https://5rndghxqgv-kairos.auth.eu-west-2.amazoncognito.com";
    
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  
    auth.removeUser()
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const closeDropdown = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      })
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen])

  const user = auth.user?.profile
  const userName = user?.name || user?.given_name || 'User'
  const userEmail = user?.email || ''
  const userInitial = userName.charAt(0).toUpperCase() || 'U'

  // Only return null if there's absolutely no user at all
  if (!auth.user) return null

  return (
    <>
      <Styled.UserButton ref={buttonRef} onClick={toggleDropdown}>
        {user?.picture ? (
          <Styled.UserAvatar 
            src={user.picture} 
            alt={userName}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
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
      
      {isOpen && createPortal(
        <>
          <Styled.DropdownOverlay onClick={closeDropdown} />
          <Styled.UserDropdown style={{ 
            position: 'fixed',
            top: dropdownPosition.top,
            right: dropdownPosition.right,
          }}>
            <Styled.UserInfo>
              <Styled.UserName>{userName}</Styled.UserName>
              {userEmail && <Styled.UserEmail>{userEmail}</Styled.UserEmail>}
            </Styled.UserInfo>
            <Styled.LogoutButton onClick={handleLogout}>
              Sign Out
            </Styled.LogoutButton>
          </Styled.UserDropdown>
        </>,
        document.body
      )}
    </>
  )
}

export default UserMenu
