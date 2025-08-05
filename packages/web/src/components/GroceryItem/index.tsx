import { Container, ActionArea, Content, Media, Name, ActionContainer, DeleteButtonIcon, QuantityDisplay, QuantityText, UnitText } from './index.styled'
import { IGroceryItemProps } from './types'
import { useAppState } from '../../providers/AppStateProvider';
import { ActionName } from '../../providers/AppStateProvider/enums';
import { useMemo, useCallback, memo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useGroceryListContext } from '../../providers/GroceryListProvider';
import { ActionButton } from '../ActionButton';

const GroceryItem = memo(({ id, name, quantity, imagePath, unit }: IGroceryItemProps) => {
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
    updateGroceryItem(id, Number(quantity) + 1)
  }, [updateGroceryItem, id, quantity])

  const handleDecrement = useCallback(() => {
    const numQuantity = Number(quantity)
    if (numQuantity > 1) {
      updateGroceryItem(id, numQuantity - 1)
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
        </Content>
      </ActionArea>
      <ActionContainer> 
          <ActionButton
            ariaLabel="Decrease quantity"
            icon={<RemoveIcon />}
            onClick={handleDecrement}
            disabled={isPurchased || Number(quantity) === 1}
          />
          <QuantityDisplay>
            <QuantityText>{quantity}</QuantityText>
            <UnitText>{unit}</UnitText>
          </QuantityDisplay>
          <ActionButton
            ariaLabel="Increase quantity"
            icon={<AddIcon />}
            onClick={handleIncrement}
            disabled={isPurchased}
          />
        </ActionContainer>
    </Container>

  )
});

GroceryItem.displayName = 'GroceryItem';

export default GroceryItem;
