import AddItemForm from '../../components/AddItemForm'
import { FormFieldType } from '../../components/AddItemForm/enums'
import { IFormField } from '../../components/AddItemForm/types'
import { addGroceryItem, retrieveGroceryListDefaults } from '../../api/groceryList'
import { validateFields } from './utils'
import { useNavigate } from 'react-router'
import { useAppState } from '../../providers/AppStateProvider'
import { useCallback } from 'react'
import { AlertColor } from '@mui/material'
import { Route } from '../../enums/route'
import { showAlert } from '../../utils/alert'
import { GroceryItemUnit, GroceryItemUnitLabelMap } from '../../enums/groceryItem'
import StandardLayout from '../../layout/standardLayout'
import ModernPageHeader from '../../components/ModernPageHeader'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useItemDefaults } from '../../hooks/useItemDefaults'
import { GroceryListProvider, useGroceryListContext } from '../../providers/GroceryListProvider'
import { useProjectContext } from '../../providers/ProjectProvider'

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
    value: 1,
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

export const AddGroceryItemContent = () => {
  const { dispatch, state } = useAppState()
  const navigate = useNavigate()
  const { groceryList } = useGroceryListContext()
  const { currentProject } = useProjectContext()
  const { defaults } = useItemDefaults({
    fetchMethod: retrieveGroceryListDefaults
  })

  const createAlert = useCallback((description: string, severity: AlertColor) => {
    showAlert({ description, severity }, dispatch)
  }, [dispatch])

  const onSubmit = useCallback(async (fields: Array<IFormField>, imagePath?: string) => {
    if (!currentProject) {
      createAlert('No project selected', 'error')
      return
    }

    try {
      const [name, quantity, unit] = validateFields(fields)

      await addGroceryItem({
        name: name.value,
        quantity: quantity.value,
        unit: unit.value as GroceryItemUnit,
        imagePath,
      }, currentProject.id)

      createAlert(`${name.value} has been added to your grocery list`, 'success')
      navigate(Route.GroceryList)
    } catch (error) {
      console.error(error)
      createAlert('Error creating grocery item', 'error')
    }
  }, [createAlert, navigate, currentProject])

  // Use same statistics as grocery list page for consistency
  const unpurchasedItems = groceryList.filter(item => !state.purchasedItems.has(item.id))
  const purchasedCount = groceryList.length - unpurchasedItems.length

  const stats = [
    { value: groceryList.length, label: 'Total Items' },
    { value: unpurchasedItems.length, label: 'Remaining' },
    { value: purchasedCount, label: 'Purchased' }
  ]

  return (
    <StandardLayout>
      <ModernPageHeader
        title="Add Grocery Item"
        icon={<ShoppingCartIcon />}
        stats={stats}
      />
      <AddItemForm
        defaults={defaults}
        fields={FIELDS}
        onSubmit={onSubmit}
      />
    </StandardLayout>
  )
}

export const AddGroceryItemRoute = () => {
  return (
    <GroceryListProvider>
      <AddGroceryItemContent />
    </GroceryListProvider>
  )
}

export default AddGroceryItemRoute
