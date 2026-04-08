import { useCallback, useMemo, memo } from 'react'
import {
  Container,
  ActionArea,
  Content,
  Name,
  DetailRow,
  BirthdayIcon,
} from './index.styled'
import { IBirthdayGroupedItemProps } from './types'
import PrivateItemBadge from '../../../PrivateItemBadge'

const formatBirthdayDate = (nextDate: string): string => {
  const [year, month, day] = nextDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

const calculateAge = (birthYear: number, nextDate: string): number => {
  const [year] = nextDate.split('-').map(Number)
  return year - birthYear
}

const BirthdayGroupedItem = memo(
  ({ birthday, onClick }: IBirthdayGroupedItemProps) => {
    const handleClick = useCallback(() => {
      onClick(birthday.id)
    }, [birthday.id, onClick])

    const formattedDate = useMemo(
      () => formatBirthdayDate(birthday.nextDate),
      [birthday.nextDate]
    )

    const age = useMemo(() => {
      if (!birthday.birthYear) return null
      return calculateAge(birthday.birthYear, birthday.nextDate)
    }, [birthday.birthYear, birthday.nextDate])

    return (
      <Container>
        <ActionArea onClick={handleClick}>
          <Content>
            <Name>
              <BirthdayIcon />
              {birthday.name}
              {birthday.visibility === 'private' && <PrivateItemBadge />}
            </Name>
            <DetailRow>
              🎂 {formattedDate}
              {age !== null && ` — turning ${age}`}
            </DetailRow>
          </Content>
        </ActionArea>
      </Container>
    )
  }
)

BirthdayGroupedItem.displayName = 'BirthdayGroupedItem'

export default BirthdayGroupedItem
