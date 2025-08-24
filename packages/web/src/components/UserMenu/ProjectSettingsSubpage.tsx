import React, { useState } from 'react'
import { Divider, ListItemIcon, ListItemText, Collapse, IconButton } from '@mui/material'
import { Add as AddIcon, Group as GroupIcon, FolderOpen as ProjectIcon, ArrowBack as ArrowBackIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import * as Styled from './index.styled'
import { useProjectContext } from '../../providers/ProjectProvider'
import ProjectInviteDisplay from '../ProjectInviteDisplay'

interface ProjectSettingsSubpageProps {
  onBack: () => void
  onCreateProject: () => void
  onJoinProject: () => void
  onProjectSwitch: (projectId: string) => void
}

const ProjectSettingsSubpage: React.FC<ProjectSettingsSubpageProps> = ({
  onBack,
  onCreateProject,
  onJoinProject,
  onProjectSwitch
}) => {
  const { projects, currentProject } = useProjectContext()
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())
  const [successMessage, setSuccessMessage] = useState('')

  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
  }

  const handleCopySuccess = (projectName: string) => {
    setSuccessMessage(`Copied invite code for ${projectName}!`)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleShareSuccess = (projectName: string) => {
    setSuccessMessage(`Shared ${projectName} invite code!`)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  return (
    <>
      <Styled.SubpageHeader>
        <Styled.BackButton onClick={onBack}>
          <ArrowBackIcon fontSize="small" />
        </Styled.BackButton>
        <Styled.SubpageTitle>Project Settings</Styled.SubpageTitle>
      </Styled.SubpageHeader>

      <Divider sx={{ my: 1 }} />

      {successMessage && (
        <div style={{
          background: '#dcfce7',
          color: '#166534',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          marginBottom: '12px',
          textAlign: 'center',
          border: '1px solid #bbf7d0'
        }}>
          {successMessage}
        </div>
      )}

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
            <IconButton
              size="small"
              onClick={() => toggleProjectExpansion(currentProject.id)}
              style={{
                transform: expandedProjects.has(currentProject.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            >
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          </Styled.CurrentProject>
          <Collapse in={expandedProjects.has(currentProject.id)}>
            <div style={{ paddingLeft: '8px', paddingRight: '8px' }}>
              <ProjectInviteDisplay
                inviteCode={currentProject.inviteCode}
                projectName={currentProject.name}
                onCopySuccess={() => handleCopySuccess(currentProject.name)}
                onShareSuccess={() => handleShareSuccess(currentProject.name)}
                compact
              />
            </div>
          </Collapse>
        </>
      )}

      {projects.length > 1 && (
        <>
          <Styled.SectionTitle>Other Projects</Styled.SectionTitle>
          {projects
            .filter(project => project.id !== currentProject?.id)
            .map(project => (
              <div key={project.id}>
                <Styled.ProjectMenuItem>
                  <ListItemIcon>
                    <ProjectIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={project.name}
                    secondary={project.isPersonal ? 'Personal' : 'Shared'}
                    onClick={() => onProjectSwitch(project.id)}
                    style={{ cursor: 'pointer', flex: 1 }}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleProjectExpansion(project.id)
                    }}
                    style={{
                      transform: expandedProjects.has(project.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <ExpandMoreIcon fontSize="small" />
                  </IconButton>
                </Styled.ProjectMenuItem>
                <Collapse in={expandedProjects.has(project.id)}>
                  <div style={{ paddingLeft: '8px', paddingRight: '8px', marginBottom: '8px' }}>
                    <ProjectInviteDisplay
                      inviteCode={project.inviteCode}
                      projectName={project.name}
                      onCopySuccess={() => handleCopySuccess(project.name)}
                      onShareSuccess={() => handleShareSuccess(project.name)}
                      compact
                    />
                  </div>
                </Collapse>
              </div>
            ))
          }
        </>
      )}

      <Divider sx={{ my: 1 }} />
      
      <Styled.ProjectMenuItem onClick={onCreateProject}>
        <ListItemIcon>
          <AddIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Create Project" />
      </Styled.ProjectMenuItem>
      
      <Styled.ProjectMenuItem onClick={onJoinProject}>
        <ListItemIcon>
          <GroupIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Join Project" />
      </Styled.ProjectMenuItem>
    </>
  )
}

export default ProjectSettingsSubpage
