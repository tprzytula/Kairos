import { render, screen, fireEvent } from '@testing-library/react'
import StepsEditor from './index'
import { IStep } from '../../api/toDoList/retrieve/types'

const STEP_1: IStep = { id: 'step-1', name: 'First step', isDone: false }
const STEP_2: IStep = { id: 'step-2', name: 'Second step', isDone: false }

describe('Given the StepsEditor component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('When rendered with no steps', () => {
    it('should render the Sub-steps title', () => {
      render(<StepsEditor steps={[]} onChange={jest.fn()} />)
      expect(screen.getByText('Sub-steps')).toBeVisible()
    })

    it('should render the Add step button', () => {
      render(<StepsEditor steps={[]} onChange={jest.fn()} />)
      expect(screen.getByRole('button', { name: /add step/i })).toBeVisible()
    })

    it('should not render any step inputs', () => {
      render(<StepsEditor steps={[]} onChange={jest.fn()} />)
      expect(screen.queryByPlaceholderText('Step name')).not.toBeInTheDocument()
    })
  })

  describe('When rendered with existing steps', () => {
    it('should render all step inputs', () => {
      render(<StepsEditor steps={[STEP_1, STEP_2]} onChange={jest.fn()} />)
      const inputs = screen.getAllByPlaceholderText('Step name')
      expect(inputs).toHaveLength(2)
    })

    it('should display each step name in its input', () => {
      render(<StepsEditor steps={[STEP_1, STEP_2]} onChange={jest.fn()} />)
      expect(screen.getByDisplayValue('First step')).toBeVisible()
      expect(screen.getByDisplayValue('Second step')).toBeVisible()
    })

    it('should render a remove button for each step', () => {
      render(<StepsEditor steps={[STEP_1, STEP_2]} onChange={jest.fn()} />)
      expect(screen.getByRole('button', { name: 'Remove step 1' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Remove step 2' })).toBeVisible()
    })
  })

  describe('When the Add step button is clicked', () => {
    it('should call onChange with the existing steps plus a new empty step appended', () => {
      jest.spyOn(crypto, 'randomUUID').mockReturnValue('new-step-id' as any)
      const onChange = jest.fn()

      render(<StepsEditor steps={[STEP_1]} onChange={onChange} />)
      fireEvent.click(screen.getByRole('button', { name: /add step/i }))

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith([
        STEP_1,
        { id: 'new-step-id', name: '', isDone: false },
      ])
    })

    it('should call onChange with a single new empty step when there are no existing steps', () => {
      jest.spyOn(crypto, 'randomUUID').mockReturnValue('new-step-id' as any)
      const onChange = jest.fn()

      render(<StepsEditor steps={[]} onChange={onChange} />)
      fireEvent.click(screen.getByRole('button', { name: /add step/i }))

      expect(onChange).toHaveBeenCalledWith([
        { id: 'new-step-id', name: '', isDone: false },
      ])
    })
  })

  describe('When the remove button for a step is clicked', () => {
    it('should call onChange with that step filtered out', () => {
      const onChange = jest.fn()

      render(<StepsEditor steps={[STEP_1, STEP_2]} onChange={onChange} />)
      fireEvent.click(screen.getByRole('button', { name: 'Remove step 1' }))

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith([STEP_2])
    })

    it('should call onChange with an empty array when removing the only step', () => {
      const onChange = jest.fn()

      render(<StepsEditor steps={[STEP_1]} onChange={onChange} />)
      fireEvent.click(screen.getByRole('button', { name: 'Remove step 1' }))

      expect(onChange).toHaveBeenCalledWith([])
    })
  })

  describe('When the user edits a step name', () => {
    it('should call onChange with the updated step name', () => {
      const onChange = jest.fn()

      render(<StepsEditor steps={[STEP_1, STEP_2]} onChange={onChange} />)

      const input = screen.getByDisplayValue('First step')
      fireEvent.change(input, { target: { value: 'Updated step' } })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith([
        { ...STEP_1, name: 'Updated step' },
        STEP_2,
      ])
    })
  })

  describe('When embedded prop is true', () => {
    it('should render without crashing', () => {
      render(<StepsEditor steps={[]} onChange={jest.fn()} embedded={true} />)
      expect(screen.getByText('Sub-steps')).toBeVisible()
    })

    it('should render the Add step button', () => {
      render(<StepsEditor steps={[STEP_1]} onChange={jest.fn()} embedded={true} />)
      expect(screen.getByRole('button', { name: /add step/i })).toBeVisible()
    })

    it('should render existing step inputs', () => {
      render(<StepsEditor steps={[STEP_1]} onChange={jest.fn()} embedded={true} />)
      expect(screen.getByDisplayValue('First step')).toBeVisible()
    })
  })

  describe('When embedded prop is false (default standalone card variant)', () => {
    it('should render without crashing', () => {
      render(<StepsEditor steps={[]} onChange={jest.fn()} embedded={false} />)
      expect(screen.getByText('Sub-steps')).toBeVisible()
    })

    it('should render the Add step button in standalone variant', () => {
      render(<StepsEditor steps={[]} onChange={jest.fn()} />)
      expect(screen.getByRole('button', { name: /add step/i })).toBeVisible()
    })
  })
})
