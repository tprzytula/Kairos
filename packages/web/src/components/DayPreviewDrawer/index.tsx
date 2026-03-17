import { Drawer, Box } from '@mui/material'
import CakeIcon from '@mui/icons-material/Cake'
import LinkIcon from '@mui/icons-material/Link'
import dayjs from 'dayjs'
import { ITodoItem } from '../../api/toDoList/retrieve/types'
import { IBirthdayItem } from '../../api/birthdays/retrieve/types'
import { IMealPlan } from '../../types/mealPlan'
import {
  DayDetailHeaderWrapper,
  DayDetailDayOfWeek,
  DayDetailDateLabel,
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
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: '16px 16px 0 0', maxHeight: '60vh', overflow: 'hidden' } }}
    >
      <Box sx={{ overflowY: 'auto', padding: '0 12px', paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <Box sx={{ width: '48px', height: '5px', backgroundColor: '#94a3b8', borderRadius: '3px', margin: '10px auto 14px', flexShrink: 0 }} />
        <DayDetailHeaderWrapper>
          <DayDetailDayOfWeek>{selectedDay ? dayjs(selectedDay).format('dddd') : ''}</DayDetailDayOfWeek>
          <DayDetailDateLabel>{selectedDay ? dayjs(selectedDay).format('D MMMM') : ''}</DayDetailDateLabel>
        </DayDetailHeaderWrapper>

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

        {birthdays.length > 0 && birthdays.map(birthday => (
          <BirthdayDayDetailItem key={birthday.id} onClick={() => onBirthdayClick?.(birthday.id)}>
            <CakeIcon sx={{ fontSize: '0.9rem', color: '#db2777', flexShrink: 0 }} />
            {birthday.name}
          </BirthdayDayDetailItem>
        ))}

        <MealsSectionHeader>
          <span>Meals</span>
          {onAddMealPlan && selectedDay && (
            <MealsAddButton onClick={(e) => { e.stopPropagation(); onAddMealPlan(selectedDay) }}>+</MealsAddButton>
          )}
        </MealsSectionHeader>
        {mealPlans.map(plan => (
          <MealDayDetailItem key={plan.id} onClick={() => onMealPlanClick?.(plan)}>
            <MealPlanIcon sx={{ fontSize: '0.9rem', flexShrink: 0 }} />
            {plan.recipeName}
            {plan.recipeId && <LinkIcon sx={{ fontSize: '0.75rem', color: '#d97706', marginLeft: 'auto', flexShrink: 0 }} />}
          </MealDayDetailItem>
        ))}
      </Box>
    </Drawer>
  )
}

export default DayPreviewDrawer
