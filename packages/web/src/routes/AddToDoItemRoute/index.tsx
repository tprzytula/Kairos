import { useState, useCallback } from 'react'
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material'
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
import { ToDoListProvider, useToDoListContext } from '../../providers/ToDoListProvider'
import { BirthdayProvider, useBirthdayContext } from '../../providers/BirthdayProvider'
import dayjs from 'dayjs'
import BirthdayForm from './BirthdayForm'

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

export const AddToDoItemContent = () => {
  const { dispatch } = useAppState()
  const { currentProject } = useProjectContext()
  const navigate = useNavigate()
  const { toDoList } = useToDoListContext()
  const { user } = useAuth()
  const [itemType, setItemType] = useState<ItemType>('task')

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

      await addTodoItem({
        name: name.value,
        description: description.value,
        dueDate: utcTimestamp,
      }, currentProject.id, user?.access_token)

      createAlert(`${name.value} has been added to your to do list`, 'success')
      navigate(Route.ToDoList)
    } catch (error) {
      console.error(error)
      createAlert('Error creating to do item', 'error')
    }
  }, [createAlert, navigate, currentProject])

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
  const headerTitle = itemType === 'birthday' ? 'Add Birthday' : 'Add To-Do Item'

  return (
    <StandardLayout>
      <ModernPageHeader
        title={headerTitle}
        icon={headerIcon}
        stats={stats}
      />
      <Box sx={{ px: 2, pt: 1 }}>
        <ToggleButtonGroup
          value={itemType}
          exclusive
          onChange={(_, value) => { if (value) setItemType(value) }}
          fullWidth
          size="small"
          sx={{
            mb: 2,
            '& .MuiToggleButton-root': {
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              gap: 0.75,
            },
            '& .MuiToggleButton-root.Mui-selected': {
              backgroundColor: itemType === 'birthday' ? '#fce7f3' : undefined,
              color: itemType === 'birthday' ? '#db2777' : undefined,
            },
          }}
        >
          <ToggleButton value="task">
            <ChecklistIcon fontSize="small" />
            Task
          </ToggleButton>
          <ToggleButton value="birthday">
            <CakeIcon fontSize="small" />
            Birthday
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {itemType === 'task' ? (
        <ItemForm
          fields={TASK_FIELDS}
          onSubmit={onSubmit}
          hideImage={true}
        />
      ) : (
        <BirthdayForm />
      )}
    </StandardLayout>
  )
}

export const AddToDoItemRoute = () => {
  return (
    <ToDoListProvider>
      <BirthdayProvider>
        <AddToDoItemContent />
      </BirthdayProvider>
    </ToDoListProvider>
  )
}

export default AddToDoItemRoute
