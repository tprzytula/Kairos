import { Container } from './index.styled'
import Navigation from '../../components/Navigation'
import Header from '../../components/Header'
import AddItemForm from '../../components/AddItemForm'
import { FormFieldType } from '../../components/AddItemForm/enums'
import { IFormField } from '../../components/AddItemForm/types'

const FIELDS: Array<IFormField> = [
  {
    name: 'name',
    label: 'Name',
    type: FormFieldType.TEXT,
    required: true,
  },
  {
    name: 'quantity',
    label: 'Quantity',
    type: FormFieldType.NUMBER,
  },
]
export const AddGroceryItemRoute = () => {
  const onSubmit = async (fields: Array<IFormField>) => {
    // TODO: Add logic to call the API to create the grocery item
    console.log(fields)
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
