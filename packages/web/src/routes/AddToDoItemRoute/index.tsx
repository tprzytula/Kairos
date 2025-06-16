import AddItemForm from '../../components/AddItemForm'
import { FormFieldType } from '../../components/AddItemForm/enums'
import { IFormField } from '../../components/AddItemForm/types'
import { addTodoItem } from '../../api/toDoList'
import { validateFields } from './utils'
import { useNavigate } from 'react-router'
import { useAppState } from '../../providers/AppStateProvider'
import { useCallback } from 'react'
import { AlertColor } from '@mui/material'
import { Route } from '../../enums/route'
import { showAlert } from '../../utils/alert'
import StandardLayout from '../../layout/standardLayout'
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

export const AddToDoItemRoute = () => {
  const { dispatch } = useAppState()
  const navigate = useNavigate()

  const createAlert = useCallback((description: string, severity: AlertColor) => {
    showAlert({ description, severity }, dispatch)
  }, [dispatch])

  const onSubmit = useCallback(async (fields: Array<IFormField>) => {
    try {
      const [name, description, dueDate] = validateFields(fields)

      const utcTimestamp = dueDate ? dayjs(dueDate.value).valueOf() : undefined

      await addTodoItem({
        name: name.value,
        description: description.value,
        dueDate: utcTimestamp,
      })

      createAlert(`${name.value} has been added to your to do list`, 'success')
      navigate(Route.ToDoList)
    } catch (error) {
      console.error(error)
      createAlert('Error creating to do item', 'error')
    }
  }, [createAlert, navigate])

  return (
    <StandardLayout
      title="Add To Do Item"
    >
      <AddItemForm
        fields={FIELDS}
        onSubmit={onSubmit}
        hideImage={true}
      />
    </StandardLayout>
  )
}

export default AddToDoItemRoute
