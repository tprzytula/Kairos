import React, { useState } from 'react'
import {
  Avatar,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  PersonRemove as PersonRemoveIcon,
} from '@mui/icons-material'
import { useAuth } from 'react-oidc-context'
import * as Styled from './index.styled'
import {
  ProjectMembersProvider,
  useProjectMembersContext,
} from '../../providers/ProjectMembersProvider'
import { useProjectContext } from '../../providers/ProjectProvider'
import { ProjectRole } from '../../types/project'
import { IProjectMemberDetails } from '../../types/projectMemberDetails'
import RemoveMemberDialog from '../RemoveMemberDialog'

interface MembersSettingsSubpageProps {
  onBack: () => void
}

const MembersList: React.FC = () => {
  const { members, isLoading, isError, removeMember } =
    useProjectMembersContext()
  const { currentProject } = useProjectContext()
  const auth = useAuth()
  const userId = auth.user?.profile?.sub
  const isOwner = currentProject?.ownerId === userId

  const [memberToRemove, setMemberToRemove] =
    useState<IProjectMemberDetails | null>(null)

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
    <>
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
            {isOwner && member.role !== ProjectRole.OWNER && (
              <IconButton
                size="small"
                aria-label={`Remove ${member.name}`}
                onClick={() => setMemberToRemove(member)}
                sx={{ color: '#ef4444', ml: 0.5 }}
              >
                <PersonRemoveIcon fontSize="small" />
              </IconButton>
            )}
          </Styled.MemberItem>
        ))}
      </Stack>

      <RemoveMemberDialog
        open={!!memberToRemove}
        memberName={memberToRemove?.name ?? ''}
        onClose={() => setMemberToRemove(null)}
        onConfirm={() => removeMember(memberToRemove!.userId)}
      />
    </>
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
