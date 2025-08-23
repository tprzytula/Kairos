import React from 'react'
import { useVersion } from '../../hooks/useVersion'
import { useProjectContext } from '../../providers/ProjectProvider'
import { 
  AppInfoCardContainer, 
  AppInfoCardContent, 
  BrandingSection,
  AppBranding, 
  ProjectName,
  VersionText 
} from './index.styled'

const AppInfoCard: React.FC = () => {
  const { version } = useVersion()
  const { currentProject } = useProjectContext()
  const displayVersion = version || '...'

  return (
    <AppInfoCardContainer>
      <AppInfoCardContent>
        <BrandingSection>
          <AppBranding>Kairos</AppBranding>
          <ProjectName>
            <span className="project-indicator">Project:</span>
            <span className="project-name">
              {currentProject ? currentProject.name : 'Loading...'}
              {currentProject?.isPersonal && ' (Personal)'}
            </span>
          </ProjectName>
        </BrandingSection>
        <VersionText>{displayVersion}</VersionText>
      </AppInfoCardContent>
    </AppInfoCardContainer>
  )
}

export default AppInfoCard
