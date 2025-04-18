import { Container } from './index.styled'
import Navigation from '../../components/Navigation'
import Header from '../../components/Header'
import AddItemForm from '../../components/AddItemForm'
import { FormFieldType } from '../../components/AddItemForm/enums'
import { IFormField } from '../../components/AddItemForm/types'
import { createGroceryItem } from '../../api'
import { validateFields } from './utils'
import { useNavigate } from 'react-router'
import { useAppState } from '../../providers/AppStateProvider'
import { useCallback } from 'react'
import { AlertColor } from '@mui/material'
import { Route } from '../../enums/route'
import { showAlert } from '../../utils/alert'

const FIELDS: Array<IFormField> = [
  {
    name: 'name',
    label: 'Name',
    type: FormFieldType.TEXT,
    required: true,
    value: '',
  },
  {
    name: 'quantity',
    label: 'Quantity',
    type: FormFieldType.NUMBER,
    required: true,
    value: 0,
  },
]
export const AddGroceryItemRoute = () => {
  const { dispatch } = useAppState()
  const navigate = useNavigate()

  const createAlert = useCallback((description: string, severity: AlertColor) => {
    showAlert({ description, severity }, dispatch)
  }, [dispatch])

  const onSubmit = async (fields: Array<IFormField>) => {
    try {
      const [name, quantity] = validateFields(fields)

      await createGroceryItem({
        name: name.value,
        quantity: quantity.value,
      })

      createAlert(`${name.value} has been added to your grocery list`, 'success')
      navigate(Route.GroceryList)
    } catch (error) {
      console.error(error)
      createAlert('Error creating grocery item', 'error')
    }
  }

  return (
    <Container>
      <Header title="Add Grocery Item" />
      <AddItemForm fields={FIELDS} onSubmit={onSubmit} />
      <Navigation previousRoute={Route.GroceryList} />
    </Container>
  )
}

export default AddGroceryItemRoute;
