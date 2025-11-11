import { useCallback, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import StandardLayout from '../../layout/standardLayout'
import ModernPageHeader from '../../components/ModernPageHeader'
import ActionButtonsBar from '../../components/ActionButtonsBar'
import ShopList from '../../components/ShopList'
import AddShopForm from '../../components/AddShopForm'
import EditShopForm from '../../components/EditShopForm'
import { useShopContext } from '../../providers/ShopProvider'
import { useAppState } from '../../providers/AppStateProvider'
import { showAlert } from '../../utils/alert'
import { Route } from '../../enums/route'
import StorefrontIcon from '@mui/icons-material/Storefront'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Container, ScrollableContainer, FormContainer } from './index.styled'

type FormMode = 'none' | 'add' | 'edit'

const ShopListContent = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { dispatch } = useAppState()
  const { 
    shops, 
    addShop, 
    updateShop, 
    deleteShop 
  } = useShopContext()
  
  const [formMode, setFormMode] = useState<FormMode>('none')
  const [editingShop, setEditingShop] = useState<{ id: string; name: string; icon?: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Check URL parameters to show add form when triggered from navigation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    if (searchParams.get('mode') === 'add') {
      setFormMode('add')
      // Clean up URL parameter
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('mode')
      window.history.replaceState({}, '', newUrl.pathname)
    }
  }, [location.search])

  const totalItems = shops.reduce((sum, shop) => sum + (shop.itemCount || 0), 0)
  
  const stats = [
    { value: shops.length, label: 'Total Shops' },
    { value: totalItems, label: 'Total Items' },
  ]

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

  const handleViewAllItems = useCallback(() => {
    navigate(Route.GroceryList.replace(':shopId', 'all'))
  }, [navigate])


  return (
    <StandardLayout>
      <ModernPageHeader
        title="Shops"
        icon={<StorefrontIcon />}
        stats={stats}
      />
      <Container>
        {formMode === 'none' ? (
          <ScrollableContainer>
            {totalItems > 0 && (
              <ActionButtonsBar
                actionButton={{
                  isEnabled: true,
                  onClick: handleViewAllItems,
                  children: (
                    <>
                      <ShoppingCartIcon style={{ marginRight: 8 }} />
                      View All Items
                    </>
                  ),
                }}
              />
            )}
            <ShopList
              shops={shops}
              onDelete={handleDeleteShop}
              onEdit={handleEditShop}
            />
          </ScrollableContainer>
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
  return <ShopListContent />
}

export default ShopListRoute
