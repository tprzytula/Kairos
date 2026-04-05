import {
  WeeklyContainer,
  WeekHeader,
  DayRow,
  DayRowHeader,
  DayRowItems,
} from '../index.styled'
import {
  NavButtonPlaceholder,
  WeekLabelPlaceholder,
  DayNamePlaceholder,
  DayNumberPlaceholder,
  DayItemPlaceholder,
} from './index.styled'

const DAY_ITEMS: number[][] = [
  [90, 70],
  [80],
  [100, 60],
  [],
  [75, 85],
  [95],
  [],
]

const WeeklyViewPlaceholder = () => (
  <WeeklyContainer aria-label="Loading weekly view">
    <WeekHeader>
      <NavButtonPlaceholder />
      <WeekLabelPlaceholder />
      <NavButtonPlaceholder />
    </WeekHeader>

    <div style={{ flex: 1, padding: '0 12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {DAY_ITEMS.map((items, index) => (
        <DayRow key={index}>
          <DayRowHeader>
            <DayNamePlaceholder />
            <DayNumberPlaceholder />
          </DayRowHeader>
          <DayRowItems>
            {items.map((width, i) => (
              <DayItemPlaceholder key={i} width={width} />
            ))}
          </DayRowItems>
        </DayRow>
      ))}
    </div>
  </WeeklyContainer>
)

export default WeeklyViewPlaceholder
