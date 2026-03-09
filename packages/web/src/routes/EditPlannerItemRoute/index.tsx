import ItemForm from '../../components/ItemForm'
import { FormFieldType } from '../../components/ItemForm/enums'
import { IFormField } from '../../components/ItemForm/types'
import { validateFields } from './utils'
import { useNavigate, useParams } from 'react-router'
import { useAppState } from '../../providers/AppStateProvider'
import { useCallback, useEffect, useState, useMemo } from 'react'
import { AlertColor } from '@mui/material'
import { Route } from '../../enums/route'
import { showAlert } from '../../utils/alert'
import StandardLayout from '../../layout/standardLayout'
import ModernPageHeader from '../../components/ModernPageHeader'
import { PlannerProvider, usePlannerContext } from '../../providers/PlannerProvider'
import { IStep, ITodoItem } from '../../api/toDoList/retrieve/types'
import ChecklistIcon from '@mui/icons-material/Checklist'
import dayjs from 'dayjs'
import StepsEditor from '../../components/StepsEditor'

const EditPlannerItemContent = () => {
  const { dispatch } = useAppState()
  const { toDoList, updateToDoItemFields } = usePlannerContext()
  const navigate = useNavigate()
  const { id } = useParams()
  const [currentItem, setCurrentItem] = useState<ITodoItem | null>(null)
  const [steps, setSteps] = useState<IStep[]>([])

  const todoItem = useMemo(() => {
    return toDoList.find(item => item.id === id) || null
  }, [toDoList, id])

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

  useEffect(() => {
    if (todoItem) {
      setCurrentItem(todoItem)
      setSteps(todoItem.steps ?? [])
    } else if (!todoItem && toDoList.length > 0) {
      createAlert('Todo item not found', 'error')
      navigate(Route.Planner)
    }
  }, [todoItem, toDoList])

  const FIELDS: Array<IFormField> = useMemo(() => [
    {
      name: 'name',
      label: 'Name',
      type: FormFieldType.TEXT,
      required: true,
      value: currentItem?.name || '',
    },
    {
      name: 'description',
      label: 'Description',
      type: FormFieldType.TEXTAREA,
      required: false,
      value: currentItem?.description || '',
    },
    {
      name: 'dueDate',
      label: 'Due Date',
      type: FormFieldType.DATE,
      required: true,
      value: currentItem?.dueDate ? dayjs(currentItem.dueDate).toISOString() : dayjs().toISOString(),
    },
  ], [currentItem])

  const createAlert = useCallback((description: string, severity: AlertColor) => {
    showAlert({ description, severity }, dispatch)
  }, [dispatch])

  const onSubmit = useCallback(async (fields: Array<IFormField>) => {
    try {
      const [name, description, dueDate] = validateFields(fields)

      const utcTimestamp = dueDate ? dayjs(dueDate.value).valueOf() : undefined

      const filteredSteps = steps.filter(s => s.name.trim() !== '')

      const updatedFields: any = {
        name: name.value,
        description: description.value,
        dueDate: utcTimestamp,
        steps: filteredSteps.length > 0 ? filteredSteps : [],
      }

      await updateToDoItemFields(id!, updatedFields)

      createAlert(`${name.value} has been updated`, 'success')
      navigate(Route.Planner)
    } catch (error) {
      console.error(error)
      createAlert('Error updating todo item', 'error')
    }
  }, [createAlert, navigate, id, updateToDoItemFields, steps])

  if (!currentItem) {
    return (
      <StandardLayout centerVertically>
        <div>Loading...</div>
      </StandardLayout>
    )
  }

  return (
    <StandardLayout>
      <ModernPageHeader
        title="Edit Task"
        icon={<ChecklistIcon />}
        stats={stats}
      />
      <ItemForm
        fields={FIELDS}
        onSubmit={onSubmit}
        hideImage={true}
        submitButtonText="Update Item"
        submittingButtonText="Updating Item..."
      >
        <StepsEditor steps={steps} onChange={setSteps} embedded />
      </ItemForm>
    </StandardLayout>
  )
}

export const EditPlannerItemRoute = () => {
  return (
    <PlannerProvider>
      <EditPlannerItemContent />
    </PlannerProvider>
  )
}

export default EditPlannerItemRoute
