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
  return (
    <AdventureItem position={position} onClick={onClick}>
      {(position === AdventurePosition.Single || position === AdventurePosition.Start) && <AdventureIconStyled />}
      {adventure.name}
    </AdventureItem>
  )
}

export default AdventureWeeklyItem
