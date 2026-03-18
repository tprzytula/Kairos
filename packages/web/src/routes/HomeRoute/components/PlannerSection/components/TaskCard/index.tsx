import React from 'react'
import CheckIcon from '@mui/icons-material/Check'
import { ITodoItem, IStep } from '../../../../../../api/toDoList/retrieve/types'
import { getDueDateClass, formatDueDateRelative } from '../../../../../../utils/dateTime'
import {
  CardWrapper,
  CardHeader,
  TaskTitle,
  DueLabel,
  ProgressBarTrack,
  ProgressBarFill,
  ProgressLabel,
  StepsContainer,
  StepRow,
} from './index.styled'

interface TaskCardProps {
  item: ITodoItem
  onStepToggle: (todoId: string, stepId: string, isDone: boolean) => void
  onCardClick: (item: ITodoItem) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ item, onStepToggle, onCardClick }) => {
  const dueDateClass = getDueDateClass(item.dueDate)
  const dueDateLabel = formatDueDateRelative(item.dueDate)
  const steps = item.steps ?? []
  const doneCount = steps.filter(s => s.isDone).length
  const totalSteps = steps.length
  const percent = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0

  const handleStepClick = (e: React.MouseEvent, step: IStep) => {
    e.stopPropagation()
    onStepToggle(item.id, step.id, !step.isDone)
  }

  return (
    <CardWrapper $dueDateClass={dueDateClass}>
      <CardHeader onClick={() => onCardClick(item)}>
        <TaskTitle>{item.name}</TaskTitle>
        {dueDateLabel && (
          <DueLabel $dueDateClass={dueDateClass}>{dueDateLabel}</DueLabel>
        )}
      </CardHeader>

      {totalSteps > 0 && (
        <>
          <ProgressBarTrack>
            <ProgressBarFill $percent={percent} />
          </ProgressBarTrack>
          <ProgressLabel>{doneCount}/{totalSteps} steps</ProgressLabel>

          <StepsContainer>
            {steps.map(step => (
              <StepRow
                key={step.id}
                $isDone={step.isDone}
                onClick={e => handleStepClick(e, step)}
              >
                <div className="step-checkbox">
                  {step.isDone && <CheckIcon sx={{ fontSize: '0.6rem' }} />}
                </div>
                <span className="step-name">{step.name}</span>
              </StepRow>
            ))}
          </StepsContainer>
        </>
      )}
    </CardWrapper>
  )
}

export default TaskCard
