import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from 'react-oidc-context'
import { Divider, ListItemIcon, ListItemText } from '@mui/material'
import { Add as AddIcon, Group as GroupIcon, FolderOpen as ProjectIcon } from '@mui/icons-material'
import * as Styled from './index.styled'
import { getPostLogoutRedirectUri, oidcConfig } from '../../config/oidc'
import { useProjectContext } from '../../providers/ProjectProvider'
import CreateProjectDialog from '../CreateProjectDialog'
import PushNotificationSettings from '../PushNotificationSettings'

const UserMenu: React.FC = () => {
  const auth = useAuth()
  const { projects, currentProject, switchProject } = useProjectContext()
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })
  const [showCreateDialog, setShowCreateDialog] = useState(false)
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

  const handleProjectSwitch = (projectId: string) => {
    switchProject(projectId).catch(error => {
      console.error('Failed to switch project:', error)
    })
    closeDropdown()
  }

  const handleCreateProject = () => {
    setShowCreateDialog(true)
    closeDropdown()
  }

  const handleJoinProject = () => {
    // TODO: Open join project dialog
    console.log('Join project clicked')
    closeDropdown()
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
            
            <Divider sx={{ my: 1 }} />
            
            <PushNotificationSettings />
            
            {currentProject && (
              <>
                <Styled.SectionTitle>Current Project</Styled.SectionTitle>
                <Styled.CurrentProject>
                  <ListItemIcon>
                    <ProjectIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={currentProject.name}
                    secondary={currentProject.isPersonal ? 'Personal' : 'Shared'}
                  />
                </Styled.CurrentProject>
              </>
            )}

            {projects.length > 1 && (
              <>
                <Styled.SectionTitle>Switch Project</Styled.SectionTitle>
                {projects
                  .filter(project => project.id !== currentProject?.id)
                  .map(project => (
                    <Styled.ProjectMenuItem 
                      key={project.id}
                      onClick={() => handleProjectSwitch(project.id)}
                    >
                      <ListItemIcon>
                        <ProjectIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={project.name}
                        secondary={project.isPersonal ? 'Personal' : 'Shared'}
                      />
                    </Styled.ProjectMenuItem>
                  ))
                }
              </>
            )}

            <Divider sx={{ my: 1 }} />
            
            <Styled.ProjectMenuItem onClick={handleCreateProject}>
              <ListItemIcon>
                <AddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Create Project" />
            </Styled.ProjectMenuItem>
            
            <Styled.ProjectMenuItem onClick={handleJoinProject}>
              <ListItemIcon>
                <GroupIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Join Project" />
            </Styled.ProjectMenuItem>

            <Divider sx={{ my: 1 }} />
            
            <Styled.LogoutButton onClick={handleLogout}>
              Sign Out
            </Styled.LogoutButton>
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
    </>
  )
}

export default UserMenu
