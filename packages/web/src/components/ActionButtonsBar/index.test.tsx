import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ActionButtonsBar from './index'
import { IActionButtonsBarProps } from './types'

const theme = createTheme()

const renderWithTheme = (props: IActionButtonsBarProps) => {
  return render(
    <ThemeProvider theme={theme}>
      <ActionButtonsBar {...props} />
    </ThemeProvider>
  )
}

describe('ActionButtonsBar component', () => {
  describe('when all sections are provided', () => {
    it('should render all three sections with proper layout', () => {
      const props: IActionButtonsBarProps = {
        expandCollapseButton: {
          isExpanded: true,
          onToggle: jest.fn(),
        },
        actionButton: {
          isEnabled: true,
          onClick: jest.fn(),
          children: 'Test Action',
        },
        viewToggleButton: {
          children: <ViewModuleIcon />,
          onClick: jest.fn(),
        },
      }

      renderWithTheme(props)

      expect(screen.getByLabelText('Collapse all')).toBeInTheDocument()
      expect(screen.getByText('Test Action')).toBeInTheDocument()
      expect(screen.getByLabelText('Toggle view mode')).toBeInTheDocument()
    })
  })

  describe('expand collapse button', () => {
    describe('when expanded is true', () => {
      it('should display collapse icon and tooltip', () => {
        const onToggle = jest.fn()
        const props: IActionButtonsBarProps = {
          expandCollapseButton: {
            isExpanded: true,
            onToggle,
          },
        }

        renderWithTheme(props)

        const button = screen.getByLabelText('Collapse all')
        expect(button).toBeInTheDocument()
        
        fireEvent.click(button)
        expect(onToggle).toHaveBeenCalledTimes(1)
      })
    })

    describe('when expanded is false', () => {
      it('should display expand icon and tooltip', () => {
        const onToggle = jest.fn()
        const props: IActionButtonsBarProps = {
          expandCollapseButton: {
            isExpanded: false,
            onToggle,
          },
        }

        renderWithTheme(props)

        const button = screen.getByLabelText('Expand all')
        expect(button).toBeInTheDocument()
        
        fireEvent.click(button)
        expect(onToggle).toHaveBeenCalledTimes(1)
      })
    })

    describe('when disabled is true', () => {
      it('should disable the button', () => {
        const props: IActionButtonsBarProps = {
          expandCollapseButton: {
            isExpanded: false,
            onToggle: jest.fn(),
            disabled: true,
          },
        }

        renderWithTheme(props)

        const button = screen.getByLabelText('Expand all')
        expect(button).toBeDisabled()
      })
    })
  })

  describe('action button', () => {
    describe('when enabled is true', () => {
      it('should render action button and handle click', () => {
        const onClick = jest.fn()
        const props: IActionButtonsBarProps = {
          actionButton: {
            isEnabled: true,
            onClick,
            children: 'Mark as Done',
          },
        }

        renderWithTheme(props)

        const button = screen.getByText('Mark as Done')
        expect(button).toBeInTheDocument()
        
        fireEvent.click(button)
        expect(onClick).toHaveBeenCalledTimes(1)
      })
    })

    describe('when enabled is false', () => {
      it('should render status text instead of button', () => {
        const props: IActionButtonsBarProps = {
          actionButton: {
            isEnabled: false,
            onClick: jest.fn(),
            children: 'Mark as Done',
            statusText: 'Select items to mark as done',
          },
        }

        renderWithTheme(props)

        expect(screen.getByText('Select items to mark as done')).toBeInTheDocument()
        expect(screen.queryByText('Mark as Done')).not.toBeInTheDocument()
      })
    })

    describe('when disabled is true', () => {
      it('should disable the action button', () => {
        const props: IActionButtonsBarProps = {
          actionButton: {
            isEnabled: true,
            onClick: jest.fn(),
            children: 'Mark as Done',
            disabled: true,
          },
        }

        renderWithTheme(props)

        const button = screen.getByText('Mark as Done')
        expect(button).toBeDisabled()
      })
    })
  })

  describe('view toggle button', () => {
    it('should render view toggle button and handle click', () => {
      const onClick = jest.fn()
      const props: IActionButtonsBarProps = {
        viewToggleButton: {
          children: <ViewModuleIcon />,
          onClick,
        },
      }

      renderWithTheme(props)

      const button = screen.getByLabelText('Toggle view mode')
      expect(button).toBeInTheDocument()
      
      fireEvent.click(button)
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    describe('when disabled is true', () => {
      it('should disable the view toggle button', () => {
        const props: IActionButtonsBarProps = {
          viewToggleButton: {
            children: <ViewModuleIcon />,
            onClick: jest.fn(),
            disabled: true,
          },
        }

        renderWithTheme(props)

        const button = screen.getByLabelText('Toggle view mode')
        expect(button).toBeDisabled()
      })
    })
  })

  describe('when no props are provided', () => {
    it('should render empty sections', () => {
      const props: IActionButtonsBarProps = {}

      const { container } = renderWithTheme(props)

      expect(container.firstChild).toBeInTheDocument()
      expect(screen.queryByLabelText(/expand|collapse/i)).not.toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('when only some sections are provided', () => {
    it('should render only the provided sections', () => {
      const props: IActionButtonsBarProps = {
        actionButton: {
          isEnabled: false,
          onClick: jest.fn(),
          children: 'Action',
          statusText: 'No items selected',
        },
      }

      renderWithTheme(props)

      expect(screen.getByText('No items selected')).toBeInTheDocument()
      expect(screen.queryByLabelText(/expand|collapse/i)).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Toggle view mode')).not.toBeInTheDocument()
    })
  })
})
