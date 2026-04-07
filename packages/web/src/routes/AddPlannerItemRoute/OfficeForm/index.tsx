import { useState, useCallback } from 'react'
import { Alert, Avatar, CircularProgress, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Button, TextField } from '@mui/material'
import { useNavigate } from 'react-router'
import dayjs from 'dayjs'
import { Route } from '../../../enums/route'
import { useAppState } from '../../../providers/AppStateProvider'
import { useOfficeAttendanceContext } from '../../../providers/OfficeAttendanceProvider'
import { useProjectMembersContext } from '../../../providers/ProjectMembersProvider'
import { IProjectMemberDetails } from '../../../types/projectMemberDetails'
import {
  FormContainer,
  FormCard,
  FormContent,
  FormFieldsContainer,
} from '../../../components/ItemForm/index.styled'

const OfficeTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background:
      'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '& fieldset': {
      borderColor: 'rgba(2, 132, 199, 0.2)',
      borderWidth: '1px',
      transition: 'all 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(2, 132, 199, 0.4)',
      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.1)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0284c7',
      borderWidth: '2px',
      boxShadow: '0 4px 16px rgba(2, 132, 199, 0.2)',
    },
    '&.Mui-disabled': {
      background: 'rgba(248, 250, 252, 0.5)',
      opacity: 0.7,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    fontWeight: '500',
    '&.Mui-focused': {
      color: '#0284c7',
      fontWeight: '600',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '14px 16px',
    fontSize: '0.95rem',
    fontWeight: '500',
    color: theme.palette.text.primary,
  },
}))

const SubmitButton = styled(Button)({
  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
  color: 'white',
  fontWeight: '600',
  fontSize: '1rem',
  padding: '0.875rem 2rem',
  borderRadius: '12px',
  textTransform: 'none',
  boxShadow: '0 4px 16px rgba(2, 132, 199, 0.3)',
  border: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  minHeight: '48px',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    background: 'linear-gradient(135deg, #0369a1 0%, #075985 100%)',
    boxShadow: '0 6px 24px rgba(2, 132, 199, 0.4)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    background:
      'linear-gradient(135deg, rgba(2,132,199,0.4) 0%, rgba(3,105,161,0.4) 100%)',
    color: 'rgba(255,255,255,0.6)',
    boxShadow: 'none',
    transform: 'none',
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover:before': {
    left: '100%',
  },
})

const OfficeFormCard = styled(FormCard)({
  '&:before': {
    background: 'linear-gradient(90deg, #0284c7 0%, #0369a1 50%, #38bdf8 100%)',
  },
})

const MemberCard = styled('div')<{ selected: boolean }>(({ selected }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 14px',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: selected ? '2px solid #0284c7' : '2px solid transparent',
  background: selected
    ? 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)'
    : 'rgba(248, 250, 252, 0.8)',
  '&:hover': {
    background: selected
      ? 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)'
      : 'rgba(241, 245, 249, 1)',
  },
}))

const MemberName = styled(Typography)({
  fontSize: '0.9rem',
  fontWeight: 500,
})

const MemberRole = styled(Typography)({
  fontSize: '0.75rem',
  color: '#64748b',
})

const OfficeForm = () => {
  const {
    state: { selectedCalendarDate },
  } = useAppState()
  const { addAttendance } = useOfficeAttendanceContext()
  const { members, isLoading: membersLoading } = useProjectMembersContext()
  const navigate = useNavigate()

  const [date, setDate] = useState(
    selectedCalendarDate ?? dayjs().format('YYYY-MM-DD'),
  )
  const [selectedMember, setSelectedMember] = useState<IProjectMemberDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async () => {
    if (!selectedMember) {
      setError('Please select a member')
      return
    }
    if (!date) {
      setError('Please select a date')
      return
    }

    setIsLoading(true)
    setError('')
    try {
      await addAttendance(date, selectedMember.userId, selectedMember.name, selectedMember.avatar)
      navigate(Route.Planner)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add office attendance')
    } finally {
      setIsLoading(false)
    }
  }, [date, selectedMember, addAttendance, navigate])

  return (
    <FormContainer>
      <OfficeFormCard>
        <FormContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} noValidate>
            <Stack spacing={2.5}>
              <FormFieldsContainer>
                <OfficeTextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isLoading}
                  slotProps={{ inputLabel: { shrink: true } }}
                />

                <Typography
                  variant="subtitle2"
                  sx={{ color: '#475569', fontWeight: 600, mt: 1 }}
                >
                  Who is going to the office?
                </Typography>

                {membersLoading ? (
                  <Stack alignItems="center" py={2}>
                    <CircularProgress size={28} sx={{ color: '#0284c7' }} />
                  </Stack>
                ) : members.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No members found
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {members.map((member) => (
                      <MemberCard
                        key={member.userId}
                        selected={selectedMember?.userId === member.userId}
                        onClick={() => setSelectedMember(member)}
                      >
                        <Avatar
                          src={member.avatar}
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: '#0284c7',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                          }}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <div>
                          <MemberName>{member.name}</MemberName>
                          <MemberRole>{member.role}</MemberRole>
                        </div>
                      </MemberCard>
                    ))}
                  </Stack>
                )}
              </FormFieldsContainer>

              <SubmitButton
                type="submit"
                variant="contained"
                disabled={isLoading || !selectedMember || !date}
                startIcon={
                  isLoading ? <CircularProgress size={20} color="inherit" /> : null
                }
                fullWidth
              >
                {isLoading ? 'Saving...' : 'Mark as Attending'}
              </SubmitButton>

              {error && (
                <Alert severity="error" sx={{ borderRadius: '12px' }}>
                  {error}
                </Alert>
              )}
            </Stack>
          </form>
        </FormContent>
      </OfficeFormCard>
    </FormContainer>
  )
}

export default OfficeForm
