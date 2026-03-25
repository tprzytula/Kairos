import { IAdventure } from '../../../types/adventure'
import { getAdventurePosition, AdventurePosition } from '../../../utils/adventure'
import { AdventureItem, AdventureIconStyled } from './index.styled'

interface IAdventureWeeklyItemProps {
  adventure: IAdventure
  dayKey: string
  onClick: () => void
}

const AdventureWeeklyItem = ({ adventure, dayKey, onClick }: IAdventureWeeklyItemProps) => {
  const position = getAdventurePosition(adventure, dayKey)
  const showIcon = position === AdventurePosition.Single || position === AdventurePosition.Start
  return (
    <AdventureItem position={position} onClick={onClick}>
      {showIcon && <AdventureIconStyled />}
      {adventure.name}
    </AdventureItem>
  )
}

export default AdventureWeeklyItem
