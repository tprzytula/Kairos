import { useState, useCallback, useMemo } from 'react'
import { Box } from '@mui/material'
import ChecklistIcon from '@mui/icons-material/Checklist'
import CakeIcon from '@mui/icons-material/Cake'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import ExploreIcon from '@mui/icons-material/Explore'
import ItemForm from '../../components/ItemForm'
import { FormFieldType } from '../../components/ItemForm/enums'
import { IFormField } from '../../components/ItemForm/types'
import { addTodoItem } from '../../api/toDoList'
import { validateFields } from './utils'
import { useNavigate, useLocation } from 'react-router'
import { useAppState } from '../../providers/AppStateProvider'
import { useProjectContext } from '../../providers/ProjectProvider'
import { useAuth } from 'react-oidc-context'
import { AlertColor } from '@mui/material'
import { Route } from '../../enums/route'
import { showAlert } from '../../utils/alert'
import StandardLayout from '../../layout/standardLayout'
import ModernPageHeader from '../../components/ModernPageHeader'
import { PlannerProvider, usePlannerContext } from '../../providers/PlannerProvider'
import { BirthdayProvider } from '../../providers/BirthdayProvider'
import { MealPlanProvider } from '../../providers/MealPlanProvider'
import { RecipeProvider } from '../../providers/RecipeProvider'
import { AdventureProvider } from '../../providers/AdventureProvider'
import dayjs from 'dayjs'
import BirthdayForm from './BirthdayForm'
import MealForm from './MealForm'
import AdventureForm from './AdventureForm'
import StepsEditor from '../../components/StepsEditor'
import { IStep } from '../../api/toDoList/retrieve/types'
import SegmentedControl, { SegmentedControlTab } from '../../components/SegmentedControl'

type ItemType = 'task' | 'birthday' | 'meal' | 'adventure'

const PLANNER_TABS: Array<SegmentedControlTab<ItemType>> = [
  {
    id: 'task',
    label: 'Task',
    icon: <ChecklistIcon sx={{ fontSize: '1.1rem' }} />,
    activeColor: '#667eea',
    activeBg: '#ffffff',
    activeShadow: 'rgba(102, 126, 234, 0.15)',
  },
  {
    id: 'meal',
    label: 'Meal',
    icon: <RestaurantIcon sx={{ fontSize: '1.1rem' }} />,
    activeColor: '#92400e',
    activeBg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    activeShadow: 'rgba(217, 119, 6, 0.2)',
  },
  {
    id: 'birthday',
    label: 'Birthday',
    icon: <CakeIcon sx={{ fontSize: '1.1rem' }} />,
    activeColor: '#db2777',
    activeBg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    activeShadow: 'rgba(219, 39, 119, 0.2)',
  },
  {
    id: 'adventure',
    label: 'Adventure',
    icon: <ExploreIcon sx={{ fontSize: '1.1rem' }} />,
    activeColor: '#0891b2',
    activeBg: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
    activeShadow: 'rgba(6, 182, 212, 0.2)',
  },
]

export const AddPlannerItemContent = () => {
  const { state: { selectedCalendarDate }, dispatch } = useAppState()
  const { currentProject } = useProjectContext()
  const navigate = useNavigate()
  const location = useLocation()
  const { toDoList: _toDoList } = usePlannerContext()
  const { user } = useAuth()
  const [itemType, setItemType] = useState<ItemType>((location.state as { itemType?: ItemType } | null)?.itemType ?? 'task')
  const [steps, setSteps] = useState<IStep[]>([])

  const taskFields = useMemo<Array<IFormField>>(() => [
    {
      name: 'name',
      label: 'Name',
      type: FormFieldType.TEXT,
      required: true,
      value: '',
    },
    {
      name: 'description',
      label: 'Description',
      type: FormFieldType.TEXTAREA,
      required: false,
      value: '',
    },
    {
      name: 'dueDate',
      label: 'Due Date',
      type: FormFieldType.DATE,
      required: true,
      value: (selectedCalendarDate ? dayjs(selectedCalendarDate) : dayjs()).toISOString(),
    },
  ], [selectedCalendarDate])

  const createAlert = useCallback((description: string, severity: AlertColor) => {
    showAlert({ description, severity }, dispatch)
  }, [dispatch])

  const onSubmit = useCallback(async (fields: Array<IFormField>) => {
    if (!currentProject) {
      createAlert('No project selected', 'error')
      return
    }

    try {
      const [name, description, dueDate] = validateFields(fields)

      const utcTimestamp = dueDate ? dayjs(dueDate.value).valueOf() : undefined

      const filteredSteps = steps.filter(s => s.name.trim() !== '')

      await addTodoItem({
        name: name.value,
        description: description.value,
        dueDate: utcTimestamp,
        steps: filteredSteps.length > 0 ? filteredSteps : undefined,
      }, currentProject.id, user?.access_token)

      createAlert(`${name.value} has been added to your planner`, 'success')
      navigate(Route.Planner)
    } catch (error) {
      console.error(error)
      createAlert('Error creating task', 'error')
    }
  }, [createAlert, navigate, currentProject, steps])

  const today = new Date()
  const currentDay = today.toLocaleDateString('en-US', { weekday: 'short' })
  const dayNumber = today.toLocaleDateString('en-US', { day: 'numeric' })
  const monthName = today.toLocaleDateString('en-US', { month: 'short' })
  const yearNumber = today.toLocaleDateString('en-US', { year: 'numeric' })

  const stats = [
    { value: currentDay, label: 'Today' },
    { value: dayNumber, label: 'Day' },
    { value: monthName, label: 'Month' },
    { value: yearNumber, label: 'Year' }
  ]

  const headerIcon = itemType === 'birthday' ? <CakeIcon /> : itemType === 'meal' ? <RestaurantIcon /> : itemType === 'adventure' ? <ExploreIcon /> : <ChecklistIcon />
  const headerTitle = itemType === 'birthday' ? 'Add Birthday' : itemType === 'meal' ? 'Add Meal' : itemType === 'adventure' ? 'Add Adventure' : 'Add Task'

  return (
    <StandardLayout>
      <ModernPageHeader
        title={headerTitle}
        icon={headerIcon}
        stats={stats}
      />
      <Box sx={{ px: 2, pt: 1, width: '100%', boxSizing: 'border-box' }}>
        <SegmentedControl
          tabs={PLANNER_TABS}
          activeTab={itemType}
          onChange={setItemType}
          collapseInactive
        />
      </Box>
      {itemType === 'task' ? (
        <ItemForm
          fields={taskFields}
          onSubmit={onSubmit}
          hideImage={true}
        >
          <StepsEditor steps={steps} onChange={setSteps} embedded />
        </ItemForm>
      ) : itemType === 'birthday' ? (
        <BirthdayForm />
      ) : itemType === 'meal' ? (
        <MealForm />
      ) : (
        <AdventureForm />
      )}
    </StandardLayout>
  )
}

export const AddPlannerItemRoute = () => {
  return (
    <PlannerProvider>
      <BirthdayProvider>
        <RecipeProvider>
          <MealPlanProvider>
            <AdventureProvider>
              <AddPlannerItemContent />
            </AdventureProvider>
          </MealPlanProvider>
        </RecipeProvider>
      </BirthdayProvider>
    </PlannerProvider>
  )
}

export default AddPlannerItemRoute
