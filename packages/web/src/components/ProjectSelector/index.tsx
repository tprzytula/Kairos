import React, { memo, useCallback } from 'react'
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material'
import { useProjectContext } from '../../providers/ProjectProvider'
import { IProjectSelectorProps } from './types'

export const ProjectSelector = memo(({ onProjectSelect }: IProjectSelectorProps) => {
  const { projects, currentProject, isLoading, switchProject } = useProjectContext()

  const handleProjectChange = useCallback((event: any) => {
    const projectId = event.target.value as string
    switchProject(projectId).catch(error => {
      console.error('Failed to switch project:', error)
    })
    if (onProjectSelect) {
      onProjectSelect(projectId)
    }
  }, [switchProject, onProjectSelect])

  if (isLoading) {
    return <CircularProgress size={24} />
  }

  if (projects.length === 0) {
    return null
  }

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel id="project-select-label">Project</InputLabel>
      <Select
        labelId="project-select-label"
        value={currentProject?.id || ''}
        label="Project"
        onChange={handleProjectChange}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.4)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#667eea',
          },
          '& .MuiSelect-icon': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          color: 'white',
        }}
      >
        {projects.map((project) => (
          <MenuItem key={project.id} value={project.id}>
            {project.name} {project.isPersonal ? '(Personal)' : ''}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
})

ProjectSelector.displayName = 'ProjectSelector'

export default ProjectSelector
