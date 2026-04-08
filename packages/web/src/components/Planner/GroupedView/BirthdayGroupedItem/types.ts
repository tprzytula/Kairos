import { IBirthdayWithNextDate } from '../../utils/timeGrouping'

export interface IBirthdayGroupedItemProps {
  birthday: IBirthdayWithNextDate
  onClick: (id: string) => void
}
