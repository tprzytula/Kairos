import { Container } from './index.styled'
import Navigation from '../../components/Navigation'
import Header from '../../components/Header'
import AddItemForm from '../../components/AddItemForm'
import { FormFieldType } from '../../components/AddItemForm/enums'
import { IFormField } from '../../components/AddItemForm/types'
import { createGroceryItem } from '../../api'
import { validateFields } from './utils'
import { useNavigate } from 'react-router'

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
  const navigate = useNavigate()

  const onSubmit = async (fields: Array<IFormField>) => {
    try {
      const [name, quantity] = validateFields(fields)

      await createGroceryItem({
        name: name.value,
        quantity: quantity.value,
      })

      navigate('/groceries')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container>
      <Header title="Add Grocery Item" />
      <AddItemForm fields={FIELDS} onSubmit={onSubmit} />
      <Navigation previousRoute="/groceries" />
    </Container>
  )
}

export default AddGroceryItemRoute;
