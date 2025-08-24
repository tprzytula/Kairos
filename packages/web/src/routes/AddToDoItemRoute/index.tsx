import AddItemForm from '../../components/AddItemForm'
import { FormFieldType } from '../../components/AddItemForm/enums'
import { IFormField } from '../../components/AddItemForm/types'
import { addTodoItem } from '../../api/toDoList'
import { validateFields } from './utils'
import { useNavigate } from 'react-router'
import { useAppState } from '../../providers/AppStateProvider'
import { useProjectContext } from '../../providers/ProjectProvider'
import { useCallback } from 'react'
import { useAuth } from 'react-oidc-context'
import { AlertColor } from '@mui/material'
import { Route } from '../../enums/route'
import { showAlert } from '../../utils/alert'
import StandardLayout from '../../layout/standardLayout'
import ModernPageHeader from '../../components/ModernPageHeader'
import ChecklistIcon from '@mui/icons-material/Checklist'
import { ToDoListProvider, useToDoListContext } from '../../providers/ToDoListProvider'
import dayjs from 'dayjs'

const FIELDS: Array<IFormField> = [
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

  // Format current date parts with consistent lengths
  const today = new Date()
  const currentDay = today.toLocaleDateString('en-US', { weekday: 'short' }) // Thu
  const dayNumber = today.toLocaleDateString('en-US', { day: 'numeric' })   // 21
  const monthName = today.toLocaleDateString('en-US', { month: 'short' })   // Aug
  const yearNumber = today.toLocaleDateString('en-US', { year: 'numeric' }) // 2025

  const stats = [
    { value: currentDay, label: 'Today' },
    { value: dayNumber, label: 'Day' },
    { value: monthName, label: 'Month' },
    { value: yearNumber, label: 'Year' }
  ]

  return (
    <StandardLayout>
      <ModernPageHeader
        title="Add To-Do Item"
        icon={<ChecklistIcon />}
        stats={stats}
      />
      <AddItemForm
        fields={FIELDS}
        onSubmit={onSubmit}
        hideImage={true}
      />
    </StandardLayout>
  )
}

export const AddToDoItemRoute = () => {
  return (
    <ToDoListProvider>
      <AddToDoItemContent />
    </ToDoListProvider>
  )
}

export default AddToDoItemRoute
