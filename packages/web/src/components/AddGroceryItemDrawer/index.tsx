import { useState, useCallback } from 'react'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import DraggableBottomDrawer from '../DraggableBottomDrawer'
import SegmentedControl, { SegmentedControlTab } from '../SegmentedControl'
import RecipeList from '../RecipeList'
import ItemForm from '../ItemForm'
import { FormFieldType } from '../ItemForm/enums'
import { IFormField } from '../ItemForm/types'
import { addGroceryItem, retrieveGroceryListDefaults } from '../../api/groceryList'
import { validateFields } from '../../routes/AddGroceryItemRoute/utils'
import { useProjectContext } from '../../providers/ProjectProvider'
import { useAppState } from '../../providers/AppStateProvider'
import { useItemDefaults } from '../../hooks/useItemDefaults'
import { showAlert } from '../../utils/alert'
import { GroceryItemUnit, GroceryItemUnitLabelMap } from '../../enums/groceryItem'
import { SECTION_GRADIENTS } from '../../constants/sectionColors'

type TabId = 'item' | 'recipe'

const GROCERY_TABS: Array<SegmentedControlTab<TabId>> = [
  {
    id: 'item',
    label: 'Item',
    icon: <AddShoppingCartIcon sx={{ fontSize: '1.1rem' }} />,
    activeColor: '#065f46',
    activeBg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    activeShadow: 'rgba(16, 185, 129, 0.2)',
  },
  {
    id: 'recipe',
    label: 'Recipe',
    icon: <MenuBookIcon sx={{ fontSize: '1.1rem' }} />,
    activeColor: '#92400e',
    activeBg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    activeShadow: 'rgba(249, 115, 22, 0.2)',
  },
]

const ITEM_FIELDS: Array<IFormField> = [
  {
    name: 'name',
    label: 'Name',
    type: FormFieldType.TEXT,
    required: true,
    autoFocus: true,
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

const DrawerHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '1rem 1.25rem',
  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  flexShrink: 0,
  gap: '0.75rem',
})

const DrawerIconBox = styled(Box)({
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: '10px',
  background: SECTION_GRADIENTS.grocery,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    color: 'white',
  },
})

const DrawerTitle = styled('span')({
  fontSize: '1.1rem',
  fontWeight: '700',
  background: SECTION_GRADIENTS.grocery,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  letterSpacing: '0.3px',
})

const ContentContainer = styled(Box)({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  overscrollBehavior: 'contain',
  display: 'flex',
  flexDirection: 'column',
})

const TabContainer = styled(Box)({
  padding: '0.75rem 1.25rem 0',
})

const RecipeContainer = styled(Box)({
  flex: 1,
  padding: '0 1.25rem 1rem',
  display: 'flex',
  flexDirection: 'column',
})

interface AddGroceryItemDrawerProps {
  open: boolean
  onClose: () => void
  shopId?: string
  onItemAdded: () => void
}

const AddGroceryItemDrawer = ({ open, onClose, shopId, onItemAdded }: AddGroceryItemDrawerProps) => {
  const [activeTab, setActiveTab] = useState<TabId>('item')
  const { currentProject } = useProjectContext()
  const { dispatch } = useAppState()
  const { defaults } = useItemDefaults({ fetchMethod: retrieveGroceryListDefaults })

  const handleClose = useCallback(() => {
    setActiveTab('item')
    onClose()
  }, [onClose])

  const handleItemSubmit = useCallback(async (fields: Array<IFormField>) => {
    if (!currentProject) {
      showAlert({ description: 'No project selected', severity: 'error' }, dispatch)
      return
    }
    if (!shopId) {
      showAlert({ description: 'No shop selected', severity: 'error' }, dispatch)
      return
    }

    const [name, quantity, unit] = validateFields(fields)

    await addGroceryItem({
      name: name.value,
      quantity: quantity.value,
      unit: unit.value as GroceryItemUnit,
      shopId,
      imagePath: '',
    }, currentProject.id)

    showAlert({ description: `${name.value} has been added to your grocery list`, severity: 'success' }, dispatch)
    onItemAdded()
    handleClose()
  }, [currentProject, shopId, dispatch, onItemAdded, handleClose])

  const handleUseRecipe = useCallback(() => {
    onItemAdded()
    handleClose()
  }, [onItemAdded, handleClose])

  return (
    <DraggableBottomDrawer
      open={open}
      onClose={handleClose}
      paperSx={{ height: 'calc(100% - env(safe-area-inset-top) - 16px)' }}
      contentSx={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      dragHandleContent={
        <DrawerHeader>
          <DrawerIconBox>
            <ShoppingCartIcon />
          </DrawerIconBox>
          <DrawerTitle>Add to List</DrawerTitle>
        </DrawerHeader>
      }
    >
      <ContentContainer>
        <TabContainer>
          <SegmentedControl
            tabs={GROCERY_TABS}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </TabContainer>

        {activeTab === 'item' ? (
          <ItemForm
            defaults={defaults}
            fields={ITEM_FIELDS}
            onSubmit={handleItemSubmit}
            hideImage={true}
          />
        ) : (
          <RecipeContainer>
            <RecipeList
              onEditRecipe={() => {}}
              onUseRecipe={handleUseRecipe}
              shopId={shopId}
              defaults={defaults}
            />
          </RecipeContainer>
        )}
      </ContentContainer>
    </DraggableBottomDrawer>
  )
}

export default AddGroceryItemDrawer
