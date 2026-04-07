import { IAdventure } from '../../../types/adventure'
import { getAdventurePosition, AdventurePosition } from '../../../utils/adventure'
import { AdventureCalendarIcon, AdventureBar, AdventureCountBadge, AdventureCountLabel } from './index.styled'

interface IAdventureCellGroupProps {
  adventures: IAdventure[]
  dayKey: string
  onAdventureClick?: (id: string) => void
}

const AdventureCellGroup = ({ adventures, dayKey, onAdventureClick }: IAdventureCellGroupProps): React.ReactNode => {
  const multiDay = adventures.filter(adv => getAdventurePosition(adv, dayKey) !== AdventurePosition.Single)

  return (
    <>
      {adventures.length === 1 ? (
        <AdventureCalendarIcon />
      ) : (
        <AdventureCountBadge>
          <AdventureCalendarIcon />
          <AdventureCountLabel>{adventures.length}</AdventureCountLabel>
        </AdventureCountBadge>
      )}
      {multiDay.map(adv => (
        <AdventureBar
          key={adv.id}
          position={getAdventurePosition(adv, dayKey)}
          onClick={() => onAdventureClick?.(adv.id)}
        />
      ))}
    </>
  )
}

export default AdventureCellGroup
