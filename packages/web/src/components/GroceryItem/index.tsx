import { Container, ActionArea, Content, Media, Name, QuantityContainer, Quantity, Unit } from './index.styled'
import { useState } from 'react'
import { IGroceryItemProps } from './types'

const GroceryItem = ({ name, quantity, imagePath, unit }: IGroceryItemProps) => {
  const [isPurchased, setIsPurchased] = useState(false)

  const markAsPurchased = () => {
    setIsPurchased((prev) => !prev)
  }

  return (
    <Container isPurchased={isPurchased}>
      <ActionArea
        onClick={markAsPurchased}
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
