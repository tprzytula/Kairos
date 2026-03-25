import { IAdventure } from '../../../types/adventure'
import { getAdventurePosition, AdventurePosition } from '../../../utils/adventure'
import { AdventureCalendarIcon, AdventureBar } from './index.styled'

interface IAdventureCellItemProps {
  adventure: IAdventure
  dayKey: string
  onClick?: () => void
}

const AdventureCellItem = ({ adventure, dayKey, onClick }: IAdventureCellItemProps) => {
  const position = getAdventurePosition(adventure, dayKey)
  if (position === AdventurePosition.Single) return <AdventureCalendarIcon />
  return <AdventureBar position={position} onClick={onClick} />
}

export default AdventureCellItem
