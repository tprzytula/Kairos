import AddItemForm from '../../components/AddItemForm'
import { FormFieldType } from '../../components/AddItemForm/enums'
import { IFormField } from '../../components/AddItemForm/types'
import { validateFields } from './utils'
import { useNavigate, useParams } from 'react-router'
import { useAppState } from '../../providers/AppStateProvider'
import { useCallback, useEffect, useState, useMemo } from 'react'
import { AlertColor } from '@mui/material'
import { Route } from '../../enums/route'
import { showAlert } from '../../utils/alert'
import StandardLayout from '../../layout/standardLayout'
import { ToDoListProvider, useToDoListContext } from '../../providers/ToDoListProvider'
import { ITodoItem } from '../../api/toDoList/retrieve/types'
import dayjs from 'dayjs'

const EditToDoItemContent = () => {
  const { dispatch } = useAppState()
  const { toDoList, updateToDoItemFields } = useToDoListContext()
  const navigate = useNavigate()
  const { id } = useParams()
  const [currentItem, setCurrentItem] = useState<ITodoItem | null>(null)

  const todoItem = useMemo(() => {
    return toDoList.find(item => item.id === id) || null
  }, [toDoList, id])

  useEffect(() => {
    if (todoItem) {
      setCurrentItem(todoItem)
    } else if (!todoItem && toDoList.length > 0) {
      createAlert('Todo item not found', 'error')
      navigate(Route.ToDoList)
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

      const updatedFields: any = {
        name: name.value,
        description: description.value,
        dueDate: utcTimestamp,
      }

      await updateToDoItemFields(id!, updatedFields)

      createAlert(`${name.value} has been updated`, 'success')
      navigate(Route.ToDoList)
    } catch (error) {
      console.error(error)
      createAlert('Error updating todo item', 'error')
    }
  }, [createAlert, navigate, id, updateToDoItemFields])

  if (!currentItem) {
    return (
      <StandardLayout
        title="Edit Todo Item"
        centerVertically
      >
        <div>Loading...</div>
      </StandardLayout>
    )
  }

  return (
    <StandardLayout
      title="Edit Todo Item"
      centerVertically
    >
      <AddItemForm
        fields={FIELDS}
        onSubmit={onSubmit}
        hideImage={true}
      />
    </StandardLayout>
  )
}

export const EditToDoItemRoute = () => {
  return (
    <ToDoListProvider>
      <EditToDoItemContent />
    </ToDoListProvider>
  )
}

export default EditToDoItemRoute