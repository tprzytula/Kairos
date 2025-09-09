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
import { GroceryItemUnit, GroceryItemUnitLabelMap } from '../../enums/groceryItem'
import StandardLayout from '../../layout/standardLayout'
import ModernPageHeader from '../../components/ModernPageHeader'
import { GroceryListProvider, useGroceryListContext } from '../../providers/GroceryListProvider'
import { ShopProvider, useShopContext } from '../../providers/ShopProvider'
import { IGroceryItem } from '../../providers/AppStateProvider/types'
import { useItemDefaults } from '../../hooks/useItemDefaults'
import { retrieveGroceryListDefaults } from '../../api/groceryList'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const EditGroceryItemContent = () => {
  const { dispatch, state } = useAppState()
  const { groceryList, updateGroceryItemFields } = useGroceryListContext()
  const navigate = useNavigate()
  const { shopId, id } = useParams<{ shopId: string; id: string }>()
  const { shops } = useShopContext()
  const [currentItem, setCurrentItem] = useState<IGroceryItem | null>(null)
  const { defaults } = useItemDefaults({
    fetchMethod: retrieveGroceryListDefaults
  })
  
  const currentShop = shops.find(shop => shop.id === shopId)

  const groceryItem = useMemo(() => {
    return groceryList.find(item => item.id === id) || null
  }, [groceryList, id])

  // Use same statistics as grocery list page for consistency
  const unpurchasedItems = groceryList.filter(item => !state.purchasedItems.has(item.id))
  const purchasedCount = groceryList.length - unpurchasedItems.length

  const stats = [
    { value: groceryList.length, label: 'Total Items' },
    { value: unpurchasedItems.length, label: 'Remaining' },
    { value: purchasedCount, label: 'Purchased' }
  ]

  useEffect(() => {
    if (groceryItem) {
      setCurrentItem(groceryItem)
    } else if (!groceryItem && groceryList.length > 0) {
      createAlert('Grocery item not found', 'error')
      navigate(Route.GroceryList.replace(':shopId', shopId || ''))
    }
  }, [groceryItem, groceryList, shopId, navigate])

  const FIELDS: Array<IFormField> = useMemo(() => [
    {
      name: 'name',
      label: 'Name',
      type: FormFieldType.TEXT,
      required: true,
      value: currentItem?.name || '',
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: FormFieldType.NUMBER,
      required: true,
      value: currentItem?.quantity || 1,
    },
    {
      name: 'unit',
      label: 'Unit',
      type: FormFieldType.SELECT,
      required: true,
      value: currentItem?.unit || GroceryItemUnit.UNIT,
      options: Object.entries(GroceryItemUnitLabelMap).map(([key, label]) => ({
        label,
        value: key,
      })),
    },
  ], [currentItem])

  const createAlert = useCallback((description: string, severity: AlertColor) => {
    showAlert({ description, severity }, dispatch)
  }, [dispatch])

  const onSubmit = useCallback(async (fields: Array<IFormField>, imagePath?: string) => {
    try {
      const [name, quantity, unit] = validateFields(fields)

      const updatedFields = {
        name: name.value,
        quantity: quantity.value,
        unit: unit.value as GroceryItemUnit,
        imagePath: imagePath || currentItem?.imagePath,
      }

      await updateGroceryItemFields(id!, updatedFields)

      createAlert(`${name.value} has been updated`, 'success')
      navigate(Route.GroceryList.replace(':shopId', shopId || ''))
    } catch (error) {
      console.error(error)
      createAlert('Error updating grocery item', 'error')
    }
  }, [createAlert, navigate, id, shopId, currentItem?.imagePath, updateGroceryItemFields])

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
        title={currentShop ? `Edit Item in ${currentShop.name}` : "Edit Grocery Item"}
        icon={<ShoppingCartIcon />}
        stats={stats}
      />
      <ItemForm
        defaults={defaults}
        fields={FIELDS}
        initialImagePath={currentItem?.imagePath}
        onSubmit={onSubmit}
        submitButtonText="Update Item"
        submittingButtonText="Updating Item..."
      />
    </StandardLayout>
  )
}

export const EditGroceryItemRoute = () => {
  const { shopId } = useParams<{ shopId: string }>()
  
  return (
    <ShopProvider>
      <GroceryListProvider shopId={shopId}>
        <EditGroceryItemContent />
      </GroceryListProvider>
    </ShopProvider>
  )
}

export default EditGroceryItemRoute