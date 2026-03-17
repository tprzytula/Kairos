import CakeIcon from '@mui/icons-material/Cake'
import LinkIcon from '@mui/icons-material/Link'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import dayjs from 'dayjs'
import { ITodoItem } from '../../api/toDoList/retrieve/types'
import { IBirthdayItem } from '../../api/birthdays/retrieve/types'
import { IMealPlan } from '../../types/mealPlan'
import {
  DayDetailItem,
  OverdueDayDetailItem,
  CompletedDayDetailItem,
  DayDetailEmpty,
  BirthdayDayDetailItem,
  MealDayDetailItem,
  MealPlanIcon,
  MealsSectionHeader,
  MealsAddButton,
} from '../Planner/CalendarView/index.styled'
import { DrawerContent, DrawerHeader, DateLabel, SectionLabel } from './index.styled'
import DraggableBottomDrawer from '../DraggableBottomDrawer'

interface IDayPreviewDrawerProps {
  open: boolean
  selectedDay: string | null
  pendingTodos: ITodoItem[]
  completedTodos: ITodoItem[]
  isOverdue: boolean
  birthdays: IBirthdayItem[]
  mealPlans: IMealPlan[]
  onClose: () => void
  onTodoClick: (id: string) => void
  onBirthdayClick?: (id: string) => void
  onAddMealPlan?: (date: string) => void
  onMealPlanClick?: (mealPlan: IMealPlan) => void
}

const DayPreviewDrawer = ({
  open,
  selectedDay,
  pendingTodos,
  completedTodos,
  isOverdue,
  birthdays,
  mealPlans,
  onClose,
  onTodoClick,
  onBirthdayClick,
  onAddMealPlan,
  onMealPlanClick,
}: IDayPreviewDrawerProps) => {
  return (
    <DraggableBottomDrawer
      open={open}
      onClose={onClose}
      paperSx={{ maxHeight: '85vh' }}
      dragHandleContent={
        <>
          <DrawerHeader>
            <CalendarTodayIcon sx={{ fontSize: '1.1rem' }} />
            {selectedDay ? dayjs(selectedDay).format('dddd') : ''}
          </DrawerHeader>
          <DateLabel>{selectedDay ? dayjs(selectedDay).format('D MMMM YYYY') : ''}</DateLabel>
        </>
      }
    >
      <DrawerContent>
        <SectionLabel color={isOverdue ? '#dc2626' : '#1d4ed8'}>Tasks</SectionLabel>
        {pendingTodos.length === 0 && completedTodos.length === 0 ? (
          <DayDetailEmpty>No tasks on this day</DayDetailEmpty>
        ) : (
          <>
            {pendingTodos.map(todo =>
              isOverdue ? (
                <OverdueDayDetailItem key={todo.id} onClick={() => onTodoClick(todo.id)}>
                  {todo.name}
                </OverdueDayDetailItem>
              ) : (
                <DayDetailItem key={todo.id} onClick={() => onTodoClick(todo.id)}>
                  {todo.name}
                </DayDetailItem>
              )
            )}
            {completedTodos.map(todo => (
              <CompletedDayDetailItem key={todo.id} onClick={() => onTodoClick(todo.id)}>
                {todo.name}
              </CompletedDayDetailItem>
            ))}
          </>
        )}

        {birthdays.length > 0 && (
          <>
            <SectionLabel color="#db2777">Birthdays</SectionLabel>
            {birthdays.map(birthday => (
              <BirthdayDayDetailItem key={birthday.id} onClick={() => onBirthdayClick?.(birthday.id)}>
                <CakeIcon sx={{ fontSize: '0.9rem', color: '#db2777', flexShrink: 0 }} />
                {birthday.name}
              </BirthdayDayDetailItem>
            ))}
          </>
        )}

        <MealsSectionHeader>
          <span>Meals</span>
          {onAddMealPlan && selectedDay && (
            <MealsAddButton onClick={(e) => { e.stopPropagation(); onAddMealPlan(selectedDay) }}>+</MealsAddButton>
          )}
        </MealsSectionHeader>
        {mealPlans.length === 0 ? (
          <DayDetailEmpty>No meals planned</DayDetailEmpty>
        ) : (
          mealPlans.map(plan => (
            <MealDayDetailItem key={plan.id} onClick={() => onMealPlanClick?.(plan)}>
              <MealPlanIcon sx={{ fontSize: '0.9rem', flexShrink: 0 }} />
              {plan.recipeName}
              {plan.recipeId && <LinkIcon sx={{ fontSize: '0.75rem', color: '#d97706', marginLeft: 'auto', flexShrink: 0 }} />}
            </MealDayDetailItem>
          ))
        )}
      </DrawerContent>
    </DraggableBottomDrawer>
  )
}

export default DayPreviewDrawer
