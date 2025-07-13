import { Container, ActionArea, Content, Media, Name, QuantityContainer, Quantity, Unit, SwipeableDeleteAction, ActionContainer, DeleteButtonIcon } from './index.styled'
import { IGroceryItemProps } from './types'
import { useAppState } from '../../providers/AppStateProvider';
import { ActionName } from '../../providers/AppStateProvider/enums';
import { useMemo, useCallback } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useGroceryListContext } from '../../providers/GroceryListProvider';
import { ActionButton } from '../ActionButton';

const GroceryItem = ({ id, name, quantity, imagePath, unit }: IGroceryItemProps) => {
  const { state: { purchasedItems }, dispatch } = useAppState()
  const isPurchased = useMemo(() => purchasedItems.has(id), [purchasedItems, id])
  const { updateGroceryItem } = useGroceryListContext()

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

  const handleIncrement = useCallback(() => {
    updateGroceryItem(id, quantity + 1)
  }, [updateGroceryItem, id, quantity])

  const handleDecrement = useCallback(() => {
    if (quantity > 1) {
      updateGroceryItem(id, quantity - 1)
    }
  }, [updateGroceryItem, id, quantity])

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
      <ActionContainer> 
          {quantity > 1 && (
            <ActionButton
              ariaLabel="Decrease quantity"
              icon={<RemoveIcon />}
              onClick={handleDecrement}
            />
          )}
          <ActionButton
            ariaLabel="Increase quantity"
            icon={<AddIcon />}
            onClick={handleIncrement}
          />
        </ActionContainer>
    </Container>

  )
};

export default GroceryItem;
