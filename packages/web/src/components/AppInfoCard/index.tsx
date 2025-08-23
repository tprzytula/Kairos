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
          <VersionText>{displayVersion}</VersionText>
        </BrandingSection>
        <ProjectName>
          {currentProject ? currentProject.name : 'Loading...'}
          {currentProject?.isPersonal && ' (Personal)'}
        </ProjectName>
      </AppInfoCardContent>
    </AppInfoCardContainer>
  )
}

export default AppInfoCard
