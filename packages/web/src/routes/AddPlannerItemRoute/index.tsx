import { useState, useCallback } from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import ChecklistIcon from '@mui/icons-material/Checklist'
import CakeIcon from '@mui/icons-material/Cake'
import ItemForm from '../../components/ItemForm'
import { FormFieldType } from '../../components/ItemForm/enums'
import { IFormField } from '../../components/ItemForm/types'
import { addTodoItem } from '../../api/toDoList'
import { validateFields } from './utils'
import { useNavigate } from 'react-router'
import { useAppState } from '../../providers/AppStateProvider'
import { useProjectContext } from '../../providers/ProjectProvider'
import { useAuth } from 'react-oidc-context'
import { AlertColor } from '@mui/material'
import { Route } from '../../enums/route'
import { showAlert } from '../../utils/alert'
import StandardLayout from '../../layout/standardLayout'
import ModernPageHeader from '../../components/ModernPageHeader'
import { PlannerProvider, usePlannerContext } from '../../providers/PlannerProvider'
import { BirthdayProvider } from '../../providers/BirthdayProvider'
import dayjs from 'dayjs'
import BirthdayForm from './BirthdayForm'
import StepsEditor from '../../components/StepsEditor'
import { IStep } from '../../api/toDoList/retrieve/types'

type ItemType = 'task' | 'birthday'

const TASK_FIELDS: Array<IFormField> = [
  {
    name: 'name',
    label: 'Name',
    type: FormFieldType.TEXT,
    required: true,
    value: '',
  },
  {
    name: 'description',
    label: 'Description',
    type: FormFieldType.TEXTAREA,
    required: false,
    value: '',
  },
  {
    name: 'dueDate',
    label: 'Due Date',
    type: FormFieldType.DATE,
    required: true,
    value: dayjs().toISOString(),
  },
]

const SegmentedControl = styled(Box)({
  display: 'flex',
  background: 'rgba(0, 0, 0, 0.06)',
  borderRadius: '14px',
  padding: '4px',
  gap: '4px',
  width: '100%',
})

interface ISegmentProps {
  active: boolean
  variant: 'task' | 'birthday'
}

const Segment = styled(Box, {
  shouldForwardProp: p => p !== 'active' && p !== 'variant',
})<ISegmentProps>(({ active, variant }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  padding: '10px 16px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '0.9rem',
  userSelect: 'none',
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  ...(active
    ? {
        background: variant === 'birthday'
          ? 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)'
          : '#ffffff',
        color: variant === 'birthday' ? '#db2777' : '#667eea',
        boxShadow: variant === 'birthday'
          ? '0 2px 8px rgba(219, 39, 119, 0.2), 0 1px 3px rgba(0,0,0,0.08)'
          : '0 2px 8px rgba(102, 126, 234, 0.15), 0 1px 3px rgba(0,0,0,0.08)',
      }
    : {
        background: 'transparent',
        color: 'rgba(0, 0, 0, 0.45)',
        '&:hover': {
          background: 'rgba(255,255,255,0.5)',
          color: 'rgba(0, 0, 0, 0.7)',
        },
      }),
}))

export const AddPlannerItemContent = () => {
  const { dispatch } = useAppState()
  const { currentProject } = useProjectContext()
  const navigate = useNavigate()
  const { toDoList } = usePlannerContext()
  const { user } = useAuth()
  const [itemType, setItemType] = useState<ItemType>('task')
  const [steps, setSteps] = useState<IStep[]>([])

  const createAlert = useCallback((description: string, severity: AlertColor) => {
    showAlert({ description, severity }, dispatch)
  }, [dispatch])

  const onSubmit = useCallback(async (fields: Array<IFormField>) => {
    if (!currentProject) {
      createAlert('No project selected', 'error')
      return
    }

    try {
      const [name, description, dueDate] = validateFields(fields)

      const utcTimestamp = dueDate ? dayjs(dueDate.value).valueOf() : undefined

      const filteredSteps = steps.filter(s => s.name.trim() !== '')

      await addTodoItem({
        name: name.value,
        description: description.value,
        dueDate: utcTimestamp,
        steps: filteredSteps.length > 0 ? filteredSteps : undefined,
      }, currentProject.id, user?.access_token)

      createAlert(`${name.value} has been added to your planner`, 'success')
      navigate(Route.Planner)
    } catch (error) {
      console.error(error)
      createAlert('Error creating task', 'error')
    }
  }, [createAlert, navigate, currentProject, steps])

  const today = new Date()
  const currentDay = today.toLocaleDateString('en-US', { weekday: 'short' })
  const dayNumber = today.toLocaleDateString('en-US', { day: 'numeric' })
  const monthName = today.toLocaleDateString('en-US', { month: 'short' })
  const yearNumber = today.toLocaleDateString('en-US', { year: 'numeric' })

  const stats = [
    { value: currentDay, label: 'Today' },
    { value: dayNumber, label: 'Day' },
    { value: monthName, label: 'Month' },
    { value: yearNumber, label: 'Year' }
  ]

  const headerIcon = itemType === 'birthday' ? <CakeIcon /> : <ChecklistIcon />
  const headerTitle = itemType === 'birthday' ? 'Add Birthday' : 'Add Task'

  return (
    <StandardLayout>
      <ModernPageHeader
        title={headerTitle}
        icon={headerIcon}
        stats={stats}
      />
      <Box sx={{ px: 2, pt: 1, width: '100%', boxSizing: 'border-box' }}>
        <SegmentedControl>
          <Segment
            active={itemType === 'task'}
            variant="task"
            onClick={() => setItemType('task')}
          >
            <ChecklistIcon sx={{ fontSize: '1.1rem' }} />
            Task
          </Segment>
          <Segment
            active={itemType === 'birthday'}
            variant="birthday"
            onClick={() => setItemType('birthday')}
          >
            <CakeIcon sx={{ fontSize: '1.1rem' }} />
            Birthday
          </Segment>
        </SegmentedControl>
      </Box>
      {itemType === 'task' ? (
        <>
          <ItemForm
            fields={TASK_FIELDS}
            onSubmit={onSubmit}
            hideImage={true}
          />
          <Box sx={{ px: 2, width: '100%', boxSizing: 'border-box' }}>
            <StepsEditor steps={steps} onChange={setSteps} />
          </Box>
        </>
      ) : (
        <BirthdayForm />
      )}
    </StandardLayout>
  )
}

export const AddPlannerItemRoute = () => {
  return (
    <PlannerProvider>
      <BirthdayProvider>
        <AddPlannerItemContent />
      </BirthdayProvider>
    </PlannerProvider>
  )
}

export default AddPlannerItemRoute
