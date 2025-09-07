import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import StandardLayout from '../../layout/standardLayout'
import ModernPageHeader from '../../components/ModernPageHeader'
import ActionButtonsBar from '../../components/ActionButtonsBar'
import ShopList from '../../components/ShopList'
import AddShopForm from '../../components/AddShopForm'
import EditShopForm from '../../components/EditShopForm'
import { ShopProvider, useShopContext } from '../../providers/ShopProvider'
import { useAppState } from '../../providers/AppStateProvider'
import { showAlert } from '../../utils/alert'
import { Route } from '../../enums/route'
import StorefrontIcon from '@mui/icons-material/Storefront'
import AddIcon from '@mui/icons-material/Add'
import { Container, ScrollableContainer, FormContainer } from './index.styled'

type FormMode = 'none' | 'add' | 'edit'

const ShopListContent = () => {
  const navigate = useNavigate()
  const { dispatch } = useAppState()
  const { 
    shops, 
    currentShop, 
    addShop, 
    updateShop, 
    deleteShop, 
    setCurrentShop 
  } = useShopContext()
  
  const [formMode, setFormMode] = useState<FormMode>('none')
  const [editingShop, setEditingShop] = useState<{ id: string; name: string; icon?: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const stats = [
    { value: shops.length, label: 'Total Shops' },
    { value: currentShop ? 1 : 0, label: 'Selected' },
  ]

  const handleAddShop = useCallback(() => {
    setFormMode('add')
  }, [])

  const handleEditShop = useCallback((shopId: string) => {
    const shop = shops.find(s => s.id === shopId)
    if (shop) {
      setEditingShop({
        id: shop.id,
        name: shop.name,
        icon: shop.icon,
      })
      setFormMode('edit')
    }
  }, [shops])

  const handleDeleteShop = useCallback(async (shopId: string) => {
    const shop = shops.find(s => s.id === shopId)
    if (!shop) return

    try {
      await deleteShop(shopId)
      
      showAlert({
        description: `"${shop.name}" shop deleted successfully`,
        severity: "success",
      }, dispatch)
    } catch (error) {
      console.error('Failed to delete shop:', error)
      showAlert({
        description: error instanceof Error ? error.message : "Failed to delete shop",
        severity: "error",
      }, dispatch)
    }
  }, [shops, deleteShop, dispatch])

  const handleFormCancel = useCallback(() => {
    setFormMode('none')
    setEditingShop(null)
    setIsSubmitting(false)
  }, [])

  const handleAddSubmit = useCallback(async (name: string, icon?: string) => {
    setIsSubmitting(true)
    try {
      await addShop({ name, icon })
      
      showAlert({
        description: `"${name}" shop created successfully`,
        severity: "success",
      }, dispatch)
      
      setFormMode('none')
    } catch (error) {
      console.error('Failed to create shop:', error)
      throw error // Re-throw to show error in form
    } finally {
      setIsSubmitting(false)
    }
  }, [addShop, dispatch])

  const handleEditSubmit = useCallback(async (shopId: string, name: string, icon?: string) => {
    setIsSubmitting(true)
    try {
      await updateShop({ id: shopId, name, icon })
      
      showAlert({
        description: `"${name}" shop updated successfully`,
        severity: "success",
      }, dispatch)
      
      setFormMode('none')
      setEditingShop(null)
    } catch (error) {
      console.error('Failed to update shop:', error)
      throw error // Re-throw to show error in form
    } finally {
      setIsSubmitting(false)
    }
  }, [updateShop, dispatch])

  const handleShopSelect = useCallback((shopId: string) => {
    const shop = shops.find(s => s.id === shopId)
    if (shop) {
      setCurrentShop(shop)
      navigate(Route.GroceryList.replace(':shopId', shopId))
    }
  }, [shops, setCurrentShop, navigate])

  // Override ShopItem click to handle navigation instead of just selection
  const shopListItems = shops.map(shop => ({
    ...shop,
    onClick: () => handleShopSelect(shop.id)
  }))

  return (
    <StandardLayout>
      <ModernPageHeader
        title="Shops"
        icon={<StorefrontIcon />}
        stats={stats}
      />
      <Container>
        {formMode === 'none' ? (
          <>
            <ActionButtonsBar
              actionButton={{
                isEnabled: true,
                onClick: handleAddShop,
                children: "Add Shop",
                statusText: "Tap to add a new shop",
              }}
            />
            <ScrollableContainer>
              <ShopList
                shops={shops}
                onDelete={handleDeleteShop}
                onEdit={handleEditShop}
              />
            </ScrollableContainer>
          </>
        ) : (
          <FormContainer>
            {formMode === 'add' ? (
              <AddShopForm
                onSubmit={handleAddSubmit}
                onCancel={handleFormCancel}
                isSubmitting={isSubmitting}
              />
            ) : formMode === 'edit' && editingShop ? (
              <EditShopForm
                shopId={editingShop.id}
                initialName={editingShop.name}
                initialIcon={editingShop.icon}
                onSubmit={handleEditSubmit}
                onCancel={handleFormCancel}
                isSubmitting={isSubmitting}
              />
            ) : null}
          </FormContainer>
        )}
      </Container>
    </StandardLayout>
  )
}

export const ShopListRoute = () => {
  return (
    <ShopProvider>
      <ShopListContent />
    </ShopProvider>
  )
}

export default ShopListRoute
