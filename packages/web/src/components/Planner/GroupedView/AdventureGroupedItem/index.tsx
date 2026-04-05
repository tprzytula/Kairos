import { useCallback, useMemo, memo } from 'react'
import { Container, ActionArea, Content, Name, DetailRow, AdventureIcon } from './index.styled'
import { IAdventureGroupedItemProps } from './types'
import PrivateItemBadge from '../../../PrivateItemBadge'

const formatAdventureDate = (date: string, endDate?: string): string => {
  const [year, month, day] = date.split('-').map(Number)
  const start = new Date(year, month - 1, day)
  const dayName = start.toLocaleDateString('en-US', { weekday: 'short' })
  const dateString = start.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  if (!endDate) {
    return `${dayName}, ${dateString}`
  }

  const [eYear, eMonth, eDay] = endDate.split('-').map(Number)
  const end = new Date(eYear, eMonth - 1, eDay)
  const endDateString = end.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return `${dayName}, ${dateString} – ${endDateString}`
}

const AdventureGroupedItem = memo(({ adventure, onClick }: IAdventureGroupedItemProps) => {
  const handleClick = useCallback(() => {
    onClick(adventure.id)
  }, [adventure.id, onClick])

  const formattedDate = useMemo(
    () => formatAdventureDate(adventure.date, adventure.endDate),
    [adventure.date, adventure.endDate],
  )

  return (
    <Container>
      <ActionArea onClick={handleClick}>
        <Content>
          <Name>
            <AdventureIcon />
            {adventure.name}
            {adventure.visibility === 'private' && <PrivateItemBadge />}
          </Name>
          <DetailRow>📅 {formattedDate}</DetailRow>
          {adventure.location && <DetailRow>📍 {adventure.location}</DetailRow>}
        </Content>
      </ActionArea>
    </Container>
  )
})

AdventureGroupedItem.displayName = 'AdventureGroupedItem'

export default AdventureGroupedItem
