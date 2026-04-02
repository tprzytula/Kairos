import React, { useCallback, useMemo, useRef, useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Collapse } from '@mui/material'
import { ITodoItem, IStep } from '../../../../../../api/toDoList/retrieve/types'
import { getDueDateClass, formatDueDateRelative } from '../../../../../../utils/dateTime'
import { useStepCompletionRewards } from '../../../../../../hooks/useStepCompletionRewards'
import { StepRewardState } from '../../../../../../hooks/useStepCompletionRewards/types'
import ConfettiBurst from '../../../../../../components/ConfettiBurst'
import CompleteTaskBanner from '../../../../../../components/CompleteTaskBanner'
import StreakIndicator from '../../../../../../components/StreakIndicator'
import {
  CardWrapper,
  CardHeader,
  TaskTitle,
  DueLabel,
  ProgressBarTrack,
  ProgressBarFill,
  ProgressLabelRow,
  ProgressLabel,
  StepsContainer,
  StepRow,
  BannerContainer,
} from './index.styled'

interface TaskCardProps {
  item: ITodoItem
  onStepToggle: (todoId: string, stepId: string, isDone: boolean) => void
  onCardClick: (item: ITodoItem) => void
  onMarkDone?: (id: string) => void
}

const sortSteps = (steps: IStep[]): IStep[] => {
  const unchecked = steps.filter(s => !s.isDone)
  const checked = steps.filter(s => s.isDone)
  return [...unchecked, ...checked]
}

const TaskCard: React.FC<TaskCardProps> = ({ item, onStepToggle, onCardClick, onMarkDone }) => {
  const [isStepsExpanded, setIsStepsExpanded] = useState(false)
  const [justCheckedId, setJustCheckedId] = useState<string | null>(null)
  const [rewardState, setRewardState] = useState<StepRewardState | null>(null)
  const [shouldReorder, setShouldReorder] = useState(true)
  const cardRef = useRef<HTMLDivElement>(null)
  const { processStepToggle, streakCount } = useStepCompletionRewards()

  const dueDateClass = getDueDateClass(item.dueDate)
  const dueDateLabel = formatDueDateRelative(item.dueDate)
  const steps = item.steps ?? []
  const doneCount = steps.filter(s => s.isDone).length
  const totalSteps = steps.length
  const percent = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0
  const isAllComplete = totalSteps > 0 && doneCount === totalSteps

  const displaySteps = useMemo(
    () => (shouldReorder ? sortSteps(steps) : steps),
    [steps, shouldReorder],
  )

  const handleStepClick = useCallback(
    (e: React.MouseEvent, step: IStep) => {
      e.stopPropagation()
      const newIsDone = !step.isDone
      const updatedSteps = steps.map(s => (s.id === step.id ? { ...s, isDone: newIsDone } : s))

      const state = processStepToggle({
        previousSteps: steps,
        updatedSteps,
        toggledStepId: step.id,
        newIsDone,
      })
      setRewardState(state)

      // Trigger bounce animation
      setJustCheckedId(newIsDone ? step.id : null)
      setTimeout(() => setJustCheckedId(null), 400)

      // Delay reorder so check animation plays first
      if (newIsDone) {
        setShouldReorder(false)
        setTimeout(() => setShouldReorder(true), 500)
      }

      onStepToggle(item.id, step.id, newIsDone)
    },
    [steps, item.id, onStepToggle, processStepToggle],
  )

  const handleProgressClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsStepsExpanded(v => !v)
  }, [])

  const handleMarkDone = useCallback(() => {
    onMarkDone?.(item.id)
  }, [onMarkDone, item.id])

  return (
    <CardWrapper
      ref={cardRef}
      $dueDateClass={dueDateClass}
      $milestone={rewardState?.milestoneReached}
    >
      <CardHeader onClick={() => onCardClick(item)}>
        <TaskTitle>{item.name}</TaskTitle>
        {dueDateLabel && <DueLabel $dueDateClass={dueDateClass}>{dueDateLabel}</DueLabel>}
      </CardHeader>

      {totalSteps > 0 && (
        <>
          <ProgressBarTrack>
            <ProgressBarFill
              $percent={percent}
              $milestone={rewardState?.milestoneReached}
              $animateGlow={rewardState !== null && rewardState.percentComplete > 0}
            />
          </ProgressBarTrack>
          <ProgressLabelRow>
            <StreakIndicator count={streakCount} visible={streakCount >= 3} />
            <ProgressLabel onClick={handleProgressClick} data-testid="progress-label">
              {percent}% · {doneCount}/{totalSteps}
              <ExpandMoreIcon
                sx={{
                  fontSize: '0.8rem',
                  transform: isStepsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 150ms ease',
                }}
              />
            </ProgressLabel>
          </ProgressLabelRow>

          <Collapse in={isStepsExpanded} timeout={150} unmountOnExit>
            <StepsContainer>
              {displaySteps.map(step => (
                <StepRow
                  key={step.id}
                  $isDone={step.isDone}
                  $justChecked={justCheckedId === step.id}
                  onClick={e => handleStepClick(e, step)}
                >
                  <div className="step-checkbox">
                    {step.isDone && <CheckIcon sx={{ fontSize: '0.6rem' }} />}
                  </div>
                  <span className="step-name">{step.name}</span>
                </StepRow>
              ))}
              {isAllComplete && onMarkDone && (
                <BannerContainer>
                  <CompleteTaskBanner onClick={handleMarkDone} compact />
                </BannerContainer>
              )}
            </StepsContainer>
          </Collapse>
        </>
      )}

      <ConfettiBurst
        trigger={rewardState?.shouldConfetti ?? false}
        anchorRef={cardRef}
      />
    </CardWrapper>
  )
}

export default TaskCard
