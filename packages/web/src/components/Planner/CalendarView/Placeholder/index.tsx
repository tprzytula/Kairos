import {
  Container,
  CalendarHeader,
  MonthLabelPlaceholder,
  NavButtonPlaceholder,
  WeekDayHeader,
  WeekDayLabel,
  CalendarGrid,
  DayCellPlaceholder,
  DayNumberPlaceholder,
} from './index.styled'

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TOTAL_CELLS = 35

const CalendarViewPlaceholder = () => (
  <Container aria-label="Loading calendar">
    <CalendarHeader>
      <NavButtonPlaceholder />
      <MonthLabelPlaceholder />
      <NavButtonPlaceholder />
    </CalendarHeader>

    <WeekDayHeader>
      {WEEK_DAYS.map(day => (
        <WeekDayLabel key={day}>{day}</WeekDayLabel>
      ))}
    </WeekDayHeader>

    <CalendarGrid>
      {Array.from({ length: TOTAL_CELLS }).map((_, index) => (
        <DayCellPlaceholder key={index}>
          <DayNumberPlaceholder />
        </DayCellPlaceholder>
      ))}
    </CalendarGrid>
  </Container>
)

export default CalendarViewPlaceholder
