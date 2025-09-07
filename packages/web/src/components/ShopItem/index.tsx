import { memo, useCallback } from 'react'
import { Container, ActionArea, Content, Media, Name, MetaInfo, IconContainer } from './index.styled'
import { IShopItemProps } from './types'
import { useShopContext } from '../../providers/ShopProvider'
import StorefrontIcon from '@mui/icons-material/Storefront'
import { useNavigate } from 'react-router'
import { Route } from '../../enums/route'

const ShopItem = memo(({ id, name, icon, createdAt, updatedAt, itemCount }: IShopItemProps) => {
  const { setCurrentShop } = useShopContext()
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    const shop = { id, name, icon, createdAt, updatedAt, projectId: '' } // projectId will be set by the provider
    setCurrentShop(shop)
    navigate(Route.GroceryList.replace(':shopId', id))
  }, [id, name, icon, createdAt, updatedAt, setCurrentShop, navigate])

  const getItemCountText = useCallback(() => {
    if (itemCount === undefined) return 'Loading items...'
    if (itemCount === 0) return 'No items'
    if (itemCount === 1) return '1 item'
    return `${itemCount} items`
  }, [itemCount])

  return (
    <Container>
      <ActionArea onClick={handleClick}>
        <Media>
          {icon ? (
            <img 
              src={icon} 
              alt={`${name} icon`} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                borderRadius: '8px'
              }} 
            />
          ) : (
            <IconContainer>
              <StorefrontIcon fontSize="inherit" />
            </IconContainer>
          )}
        </Media>
        <Content>
          <Name>{name}</Name>
          <MetaInfo>
            {getItemCountText()}
          </MetaInfo>
        </Content>
      </ActionArea>
    </Container>
  )
})

ShopItem.displayName = 'ShopItem'

export default ShopItem
