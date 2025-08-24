import React from 'react'
import { Divider, ListItemIcon, ListItemText } from '@mui/material'
import { Add as AddIcon, Group as GroupIcon, FolderOpen as ProjectIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import * as Styled from './index.styled'
import { useProjectContext } from '../../providers/ProjectProvider'

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

  return (
    <>
      <Styled.SubpageHeader>
        <Styled.BackButton onClick={onBack}>
          <ArrowBackIcon fontSize="small" />
        </Styled.BackButton>
        <Styled.SubpageTitle>Project Settings</Styled.SubpageTitle>
      </Styled.SubpageHeader>

      <Divider sx={{ my: 1 }} />

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
                onClick={() => onProjectSwitch(project.id)}
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
