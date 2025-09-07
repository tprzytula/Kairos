import { memo, useCallback } from 'react'
import { Container, ActionArea, Content, Media, Name, MetaInfo, IconContainer } from './index.styled'
import { IShopItemProps } from './types'
import { useShopContext } from '../../providers/ShopProvider'
import StorefrontIcon from '@mui/icons-material/Storefront'

const ShopItem = memo(({ id, name, icon, createdAt, updatedAt }: IShopItemProps) => {
  const { setCurrentShop } = useShopContext()

  const handleClick = useCallback(() => {
    const shop = { id, name, icon, createdAt, updatedAt, projectId: '' } // projectId will be set by the provider
    setCurrentShop(shop)
  }, [id, name, icon, createdAt, updatedAt, setCurrentShop])

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }, [])

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
            Created {formatDate(createdAt)}
          </MetaInfo>
        </Content>
      </ActionArea>
    </Container>
  )
})

ShopItem.displayName = 'ShopItem'

export default ShopItem
