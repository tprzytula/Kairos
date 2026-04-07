import CakeIcon from '@mui/icons-material/Cake'
import LinkIcon from '@mui/icons-material/Link'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ExploreIcon from '@mui/icons-material/Explore'
import BusinessIcon from '@mui/icons-material/Business'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import dayjs from 'dayjs'
import { Avatar, IconButton } from '@mui/material'
import { ITodoItem } from '../../api/toDoList/retrieve/types'
import { IBirthdayItem } from '../../api/birthdays/retrieve/types'
import { IMealPlan } from '../../types/mealPlan'
import { IAdventure } from '../../types/adventure'
import { IOfficeAttendance } from '../../types/officeAttendance'
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
  AdventureDayDetailItem,
  AdventuresSectionHeader,
  TasksAddButton,
  AdventuresAddButton,
} from '../Planner/CalendarView/index.styled'
import {
  DAY_PREVIEW_GRADIENT,
  DrawerContent,
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitleGroup,
  DrawerTitle,
  DrawerSubtitle,
  SectionLabel,
  TimeBadge,
} from './index.styled'
import PrivateItemBadge from '../PrivateItemBadge'
import DraggableBottomDrawer from '../DraggableBottomDrawer'

interface IDayPreviewDrawerProps {
  open: boolean
  selectedDay: string | null
  pendingTodos: ITodoItem[]
  completedTodos: ITodoItem[]
  isOverdue: boolean
  birthdays: IBirthdayItem[]
  mealPlans: IMealPlan[]
  adventures?: IAdventure[]
  officeAttendance?: IOfficeAttendance[]
  onClose: () => void
  onTodoClick: (id: string) => void
  onBirthdayClick?: (id: string) => void
  onAddMealPlan?: (date: string) => void
  onMealPlanClick?: (mealPlan: IMealPlan) => void
  onAdventureClick?: (id: string) => void
  onAddAdventure?: (date: string) => void
  onAddTask?: (date: string) => void
  onRemoveAttendance?: (id: string) => void
}

const getTodoTime = (todo: ITodoItem): string | null => {
  if (!todo.dueDate) return null
  const d = dayjs(todo.dueDate)
  const hour = d.hour()
  const minute = d.minute()
  if (hour === 0 && minute === 0) return null
  return d.format('h:mm A')
}

const formatAdventureTime = (time?: string): string | null => {
  if (!time) return null
  return dayjs(`2000-01-01 ${time}`).format('h:mm A')
}

const DayPreviewDrawer = ({
  open,
  selectedDay,
  pendingTodos,
  completedTodos,
  isOverdue,
  birthdays,
  mealPlans,
  adventures = [],
  officeAttendance = [],
  onClose,
  onTodoClick,
  onBirthdayClick,
  onAddMealPlan,
  onMealPlanClick,
  onAdventureClick,
  onAddAdventure,
  onAddTask,
  onRemoveAttendance,
}: IDayPreviewDrawerProps) => {
  return (
    <DraggableBottomDrawer
      open={open}
      onClose={onClose}
      paperSx={{ maxHeight: '85vh' }}
      dragHandleContent={
        <DrawerHeader>
          <DrawerHeaderLeft>
            <DrawerIconBox gradient={DAY_PREVIEW_GRADIENT}>
              <CalendarTodayIcon />
            </DrawerIconBox>
            <DrawerTitleGroup>
              <DrawerTitle gradient={DAY_PREVIEW_GRADIENT}>
                {selectedDay ? dayjs(selectedDay).format('dddd') : ''}
              </DrawerTitle>
              <DrawerSubtitle>
                {selectedDay ? dayjs(selectedDay).format('D MMMM YYYY') : ''}
              </DrawerSubtitle>
            </DrawerTitleGroup>
          </DrawerHeaderLeft>
        </DrawerHeader>
      }
    >
      <DrawerContent>
        <SectionLabel
          color={isOverdue ? '#dc2626' : '#1d4ed8'}
          sx={{ mt: 0, pt: 0, borderTop: 'none' }}
        >
          Tasks
          {onAddTask && selectedDay && (
            <TasksAddButton onClick={(e) => { e.stopPropagation(); onAddTask(selectedDay) }}>+</TasksAddButton>
          )}
        </SectionLabel>
        {pendingTodos.length === 0 && completedTodos.length === 0 ? (
          <DayDetailEmpty>No tasks on this day</DayDetailEmpty>
        ) : (
          <>
            {pendingTodos.map(todo => {
              const time = getTodoTime(todo)
              return isOverdue ? (
                <OverdueDayDetailItem key={todo.id} onClick={() => onTodoClick(todo.id)}>
                  {time && <TimeBadge>{time}</TimeBadge>}
                  {todo.name}
                  {todo.visibility === 'private' && <PrivateItemBadge />}
                </OverdueDayDetailItem>
              ) : (
                <DayDetailItem key={todo.id} onClick={() => onTodoClick(todo.id)}>
                  {time && <TimeBadge>{time}</TimeBadge>}
                  {todo.name}
                  {todo.visibility === 'private' && <PrivateItemBadge />}
                </DayDetailItem>
              )
            })}
            {completedTodos.map(todo => {
              const time = getTodoTime(todo)
              return (
                <CompletedDayDetailItem key={todo.id} onClick={() => onTodoClick(todo.id)}>
                  {time && <TimeBadge>{time}</TimeBadge>}
                  {todo.name}
                  {todo.visibility === 'private' && <PrivateItemBadge />}
                </CompletedDayDetailItem>
              )
            })}
          </>
        )}

        {birthdays.length > 0 && (
          <>
            <SectionLabel color="#db2777">Birthdays</SectionLabel>
            {birthdays.map(birthday => (
              <BirthdayDayDetailItem key={birthday.id} onClick={() => onBirthdayClick?.(birthday.id)}>
                <CakeIcon sx={{ fontSize: '0.9rem', color: '#db2777', flexShrink: 0 }} />
                {birthday.name}
                {birthday.visibility === 'private' && <PrivateItemBadge />}
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
              {plan.mealType && <TimeBadge>{plan.mealType}</TimeBadge>}
              {plan.recipeName}
              {plan.visibility === 'private' && <PrivateItemBadge />}
              {plan.recipeId && <LinkIcon sx={{ fontSize: '0.75rem', color: '#d97706', marginLeft: 'auto', flexShrink: 0 }} />}
            </MealDayDetailItem>
          ))
        )}

        <AdventuresSectionHeader>
          Adventures
          {onAddAdventure && selectedDay && (
            <AdventuresAddButton onClick={(e) => { e.stopPropagation(); onAddAdventure(selectedDay) }}>+</AdventuresAddButton>
          )}
        </AdventuresSectionHeader>
        {adventures.length === 0 ? (
          <DayDetailEmpty>No adventures planned</DayDetailEmpty>
        ) : (
          adventures.map(adventure => {
            const time = formatAdventureTime(adventure.time)
            return (
              <AdventureDayDetailItem key={adventure.id} onClick={() => onAdventureClick?.(adventure.id)}>
                <ExploreIcon sx={{ fontSize: '0.9rem', color: '#06b6d4', flexShrink: 0 }} />
                {time && <TimeBadge>{time}</TimeBadge>}
                <span style={{ flex: 1 }}>{adventure.name}</span>
                {adventure.visibility === 'private' && <PrivateItemBadge />}
              </AdventureDayDetailItem>
            )
          })
        )}
        <SectionLabel color="#0284c7">
          <BusinessIcon sx={{ fontSize: '0.75rem' }} />
          Office
        </SectionLabel>
        {officeAttendance.length === 0 ? (
          <DayDetailEmpty>No one at the office</DayDetailEmpty>
        ) : (
          officeAttendance.map(entry => (
            <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '8px', background: 'rgba(2, 132, 199, 0.04)', marginBottom: '4px' }}>
              <Avatar
                src={entry.userAvatar}
                sx={{ width: 28, height: 28, bgcolor: '#0284c7', fontSize: '0.75rem', fontWeight: 600 }}
              >
                {entry.userName.charAt(0).toUpperCase()}
              </Avatar>
              <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#334155', flex: 1 }}>
                {entry.userName}
              </span>
              {onRemoveAttendance && (
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); onRemoveAttendance(entry.id) }}
                  sx={{ padding: '2px', color: '#94a3b8', '&:hover': { color: '#ef4444' } }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: '0.9rem' }} />
                </IconButton>
              )}
            </div>
          ))
        )}
      </DrawerContent>
    </DraggableBottomDrawer>
  )
}

export default DayPreviewDrawer
