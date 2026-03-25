import { IAdventure } from '../../../types/adventure'
import { getAdventurePosition } from '../../../utils/adventure'
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
      {(position === 'single' || position === 'start') && <AdventureIconStyled />}
      {adventure.name}
    </AdventureItem>
  )
}

export default AdventureWeeklyItem
