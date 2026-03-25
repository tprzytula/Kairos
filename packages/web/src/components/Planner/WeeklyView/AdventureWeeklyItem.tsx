import { useCallback } from 'react'
import { IAdventure } from '../../../types/adventure'
import { getAdventurePosition, AdventurePosition } from '../../../utils/adventure'
import { AdventureItem, AdventureIconStyled } from './index.styled'

interface IAdventureWeeklyItemProps {
  adventure: IAdventure
  dayKey: string
  onClick: () => void
  onMeasure?: (id: string, width: number) => void
  measuredWidth?: number
}

const AdventureWeeklyItem = ({ adventure, dayKey, onClick, onMeasure, measuredWidth }: IAdventureWeeklyItemProps) => {
  const position = getAdventurePosition(adventure, dayKey)
  const isStart = position === AdventurePosition.Start
  const showLabel = position === AdventurePosition.Single || isStart

  const refCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && isStart && onMeasure) {
        onMeasure(adventure.id, node.offsetWidth)
      }
    },
    [adventure.id, isStart, onMeasure]
  )

  const widthStyle = !showLabel && measuredWidth ? { width: measuredWidth } : undefined

  return (
    <AdventureItem
      ref={isStart ? refCallback : undefined}
      position={position}
      style={widthStyle}
      onClick={onClick}
    >
      {showLabel && (
        <>
          <AdventureIconStyled />
          {adventure.name}
        </>
      )}
    </AdventureItem>
  )
}

export default AdventureWeeklyItem
