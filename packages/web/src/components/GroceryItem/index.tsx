import { Container, ActionArea, Content, Media, Name, QuantityContainer, Quantity, Unit } from './index.styled'
import { GroceryItemUnit } from '../../enums/groceryItem'

export interface IGroceryItemProps {
  name: string;
  quantity: number;
  imagePath: string;
  unit: GroceryItemUnit;
}

const GroceryItem = ({ name, quantity, imagePath, unit }: IGroceryItemProps) => {

  return (
    <Container>
      <ActionArea>  
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
