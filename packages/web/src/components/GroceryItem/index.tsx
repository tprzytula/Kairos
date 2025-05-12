import { Container, ActionArea, Content, Media, Name, QuantityContainer, Quantity, Unit, SwipeableDeleteAction } from './index.styled'
import { IGroceryItemProps } from './types'
import { useAppState } from '../../providers/AppStateProvider';
import { ActionName } from '../../providers/AppStateProvider/enums';
import { useMemo, useCallback } from 'react';

const GroceryItem = ({ id, name, quantity, imagePath, unit }: IGroceryItemProps) => {
  const { state: { purchasedItems }, dispatch } = useAppState()
  const isPurchased = useMemo(() => purchasedItems.has(id), [purchasedItems, id])

  const markAsPurchased = useCallback(  () => {
    dispatch({
      type: ActionName.PURCHASE_GROCERY_ITEM,
      payload: {
        id,
      },
    })
  }, [dispatch, id])

  const clearPurchasedItem = useCallback(() => {
    dispatch({
      type: ActionName.CLEAR_PURCHASED_ITEM,
      payload: {
        id,
      },
    })
  }, [dispatch, id])

  const handleClick = useCallback(() => {
    if (isPurchased) {
      clearPurchasedItem()
    } else {
      markAsPurchased()
    }
  }, [isPurchased, clearPurchasedItem, markAsPurchased])

  return (
    <Container isPurchased={isPurchased}>
      <ActionArea
        onClick={handleClick}
      >  
        <Media 
          image={imagePath}
        />
        <Content>
          <Name>{name}</Name>
          <QuantityContainer>
            <Quantity>{quantity}</Quantity>
            <Unit>{unit}</Unit>
          </QuantityContainer>
        </Content>
      </ActionArea>
    </Container>

  )
};

export default GroceryItem;
