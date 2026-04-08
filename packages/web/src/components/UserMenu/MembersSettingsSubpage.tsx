import React from 'react'
import {
  Avatar,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import * as Styled from './index.styled'
import {
  ProjectMembersProvider,
  useProjectMembersContext,
} from '../../providers/ProjectMembersProvider'
import { ProjectRole } from '../../types/project'

interface MembersSettingsSubpageProps {
  onBack: () => void
}

const MembersList: React.FC = () => {
  const { members, isLoading, isError } = useProjectMembersContext()

  if (isLoading) {
    return (
      <Stack alignItems="center" py={3}>
        <CircularProgress size={28} sx={{ color: '#667eea' }} />
      </Stack>
    )
  }

  if (isError) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center', py: 2 }}
      >
        Failed to load members
      </Typography>
    )
  }

  if (members.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center', py: 2 }}
      >
        No members found
      </Typography>
    )
  }

  return (
    <Stack spacing={0.5}>
      {members.map((member) => (
        <Styled.MemberItem key={member.userId}>
          <Avatar
            src={member.avatar}
            sx={{
              width: 36,
              height: 36,
              bgcolor: '#667eea',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            {member.name.charAt(0).toUpperCase()}
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Styled.MemberNameText>{member.name}</Styled.MemberNameText>
          </div>
          <Styled.RoleBadge isOwner={member.role === ProjectRole.OWNER}>
            {member.role === ProjectRole.OWNER ? 'Owner' : 'Member'}
          </Styled.RoleBadge>
        </Styled.MemberItem>
      ))}
    </Stack>
  )
}

const MembersSettingsSubpage: React.FC<MembersSettingsSubpageProps> = ({
  onBack,
}) => {
  return (
    <>
      <Styled.SubpageHeader>
        <Styled.BackButton onClick={onBack}>
          <ArrowBackIcon fontSize="small" />
        </Styled.BackButton>
        <Styled.SubpageTitle>Project Members</Styled.SubpageTitle>
      </Styled.SubpageHeader>

      <Divider sx={{ my: 1 }} />

      <ProjectMembersProvider>
        <MembersList />
      </ProjectMembersProvider>
    </>
  )
}

export default MembersSettingsSubpage
