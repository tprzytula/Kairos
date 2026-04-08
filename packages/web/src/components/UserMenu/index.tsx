import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from 'react-oidc-context'
import { useNavigate } from 'react-router'
import { Divider, ListItemIcon, ListItemText } from '@mui/material'
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ShoppingCart as ShoppingCartIcon,
  VolumeUp as VolumeUpIcon,
} from '@mui/icons-material'
import * as Styled from './index.styled'
import { getPostLogoutRedirectUri, oidcConfig } from '../../config/oidc'
import { useProjectContext } from '../../providers/ProjectProvider'
import { useVersion } from '../../hooks/useVersion'
import { Route } from '../../enums/route'
import CreateProjectDialog from '../CreateProjectDialog'
import JoinProjectDialog from '../JoinProjectDialog'
import LeaveProjectDialog from '../LeaveProjectDialog'
import ProjectSettingsSubpage from './ProjectSettingsSubpage'
import NotificationSettingsSubpage from './NotificationSettingsSubpage'
import GrocerySettingsSubpage from './GrocerySettingsSubpage'

type SubpageView = 'main' | 'projects' | 'notifications' | 'grocery'

const UserMenu: React.FC = () => {
  const auth = useAuth()
  const navigate = useNavigate()
  const { projects, switchProject, leaveProject } = useProjectContext()
  const { version } = useVersion()
  const [isOpen, setIsOpen] = useState(false)
  const [currentView, setCurrentView] = useState<SubpageView>('main')
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showJoinDialog, setShowJoinDialog] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [projectToLeave, setProjectToLeave] = useState<string | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleLogout = () => {
    const clientId = oidcConfig.client_id
    const logoutUri = getPostLogoutRedirectUri()
    const cognitoDomain =
      'https://5rndghxqgv-kairos.auth.eu-west-2.amazoncognito.com'

    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`

    auth.removeUser()
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const closeDropdown = () => {
    setIsOpen(false)
    setCurrentView('main')
  }

  const handleProjectSwitch = (projectId: string) => {
    switchProject(projectId).catch((error) => {
      console.error('Failed to switch project:', error)
    })
    closeDropdown()
  }

  const handleCreateProject = () => {
    setShowCreateDialog(true)
    closeDropdown()
  }

  const handleJoinProject = () => {
    setShowJoinDialog(true)
    closeDropdown()
  }

  const handleLeaveProject = (projectId: string) => {
    setProjectToLeave(projectId)
    setShowLeaveDialog(true)
    closeDropdown()
  }

  const handleLeaveProjectConfirm = async () => {
    if (projectToLeave) {
      await leaveProject(projectToLeave)
    }
  }

  const handleShowProjectSettings = () => {
    setCurrentView('projects')
  }

  const handleShowNotificationSettings = () => {
    setCurrentView('notifications')
  }

  const handleShowGrocerySettings = () => {
    setCurrentView('grocery')
  }

  const handleNavigateToNoiseTracking = () => {
    navigate(Route.NoiseTracking)
    closeDropdown()
  }

  const handleBackToMain = () => {
    setCurrentView('main')
  }

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
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
            fontWeight: 'bold',
          }}
        >
          {userInitial}
        </div>
      </Styled.UserButton>

      {isOpen &&
        createPortal(
          <>
            <Styled.DropdownOverlay onClick={closeDropdown} />
            <Styled.UserDropdown
              style={{
                position: 'fixed',
                top: dropdownPosition.top,
                right: dropdownPosition.right,
              }}
            >
              {currentView === 'main' && (
                <>
                  <Styled.UserInfo>
                    <Styled.UserName>{userName}</Styled.UserName>
                    {userEmail && (
                      <Styled.UserEmail>{userEmail}</Styled.UserEmail>
                    )}
                  </Styled.UserInfo>

                  <Divider sx={{ my: 1 }} />

                  <Styled.MainMenuItem onClick={handleShowProjectSettings}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Project Settings" />
                  </Styled.MainMenuItem>

                  <Styled.MainMenuItem onClick={handleShowNotificationSettings}>
                    <ListItemIcon>
                      <NotificationsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Notification Settings" />
                  </Styled.MainMenuItem>

                  <Styled.MainMenuItem onClick={handleShowGrocerySettings}>
                    <ListItemIcon>
                      <ShoppingCartIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Grocery Settings" />
                  </Styled.MainMenuItem>

                  <Styled.MainMenuItem onClick={handleNavigateToNoiseTracking}>
                    <ListItemIcon>
                      <VolumeUpIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Noise Tracking" />
                  </Styled.MainMenuItem>

                  <Divider sx={{ my: 1 }} />

                  <Styled.LogoutButton onClick={handleLogout}>
                    Sign Out
                  </Styled.LogoutButton>

                  {version && (
                    <Styled.VersionFooter>{version}</Styled.VersionFooter>
                  )}
                </>
              )}

              {currentView === 'projects' && (
                <ProjectSettingsSubpage
                  onBack={handleBackToMain}
                  onCreateProject={handleCreateProject}
                  onJoinProject={handleJoinProject}
                  onProjectSwitch={handleProjectSwitch}
                  onLeaveProject={handleLeaveProject}
                />
              )}

              {currentView === 'notifications' && (
                <NotificationSettingsSubpage onBack={handleBackToMain} />
              )}

              {currentView === 'grocery' && (
                <GrocerySettingsSubpage onBack={handleBackToMain} />
              )}
            </Styled.UserDropdown>
          </>,
          document.body
        )}

      <CreateProjectDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={() => {
          // Project will automatically be selected by ProjectProvider
          setShowCreateDialog(false)
        }}
      />

      <JoinProjectDialog
        open={showJoinDialog}
        onClose={() => setShowJoinDialog(false)}
        onSuccess={() => {
          // Projects will automatically be refreshed by ProjectProvider
          setShowJoinDialog(false)
        }}
      />

      <LeaveProjectDialog
        open={showLeaveDialog}
        projectName={projects.find((p) => p.id === projectToLeave)?.name || ''}
        onClose={() => {
          setShowLeaveDialog(false)
          setProjectToLeave(null)
        }}
        onConfirm={handleLeaveProjectConfirm}
      />
    </>
  )
}

export default UserMenu
