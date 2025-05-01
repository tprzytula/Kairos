import AddItemForm from '../../components/AddItemForm'
import { FormFieldType } from '../../components/AddItemForm/enums'
import { IFormField } from '../../components/AddItemForm/types'
import { addGroceryItem } from '../../api/groceryList'
import { validateFields } from './utils'
import { useNavigate } from 'react-router'
import { useAppState } from '../../providers/AppStateProvider'
import { useCallback } from 'react'
import { AlertColor } from '@mui/material'
import { Route } from '../../enums/route'
import { showAlert } from '../../utils/alert'
import { GroceryItemUnit, GroceryItemUnitLabelMap } from '../../enums/groceryItem'
import StandardLayout from '../../layout/standardLayout'

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
  {
    name: 'unit',
    label: 'Unit',
    type: FormFieldType.SELECT,
    required: true,
    value: GroceryItemUnit.UNIT,
    options: Object.entries(GroceryItemUnitLabelMap).map(([key, label]) => ({
      label,
      value: key,
    })),
  },
]

export const AddGroceryItemRoute = () => {
  const { dispatch } = useAppState()
  const navigate = useNavigate()

  const createAlert = useCallback((description: string, severity: AlertColor) => {
    showAlert({ description, severity }, dispatch)
  }, [dispatch])

  const onSubmit = async (fields: Array<IFormField>, imagePath: string) => {
    try {
      const [name, quantity, unit] = validateFields(fields)

      await addGroceryItem({
        name: name.value,
        quantity: quantity.value,
        unit: unit.value as GroceryItemUnit,
        imagePath,
      })

      createAlert(`${name.value} has been added to your grocery list`, 'success')
      navigate(Route.GroceryList)
    } catch (error) {
      console.error(error)
      createAlert('Error creating grocery item', 'error')
    }
  }

  return (
    <StandardLayout
      title="Add Grocery Item"
      previousRoute={Route.GroceryList}
    >
      <AddItemForm
        fields={FIELDS}
        onSubmit={onSubmit}
      />
    </StandardLayout>
  )
}

export default AddGroceryItemRoute
