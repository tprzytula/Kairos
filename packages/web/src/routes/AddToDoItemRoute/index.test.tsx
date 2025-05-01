import { act, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import AddToDoItemRoute from '.'
import * as ReactRouter from 'react-router'
import AddItemForm from '../../components/AddItemForm'
import { addTodoItem } from '../../api/toDoList'
import { FormFieldType } from '../../components/AddItemForm/enums'

jest.mock('../../api/toDoList');
jest.mock('../../components/AddItemForm');
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}))

describe('Given the AddToDoItemRoute component', () => {
  it('should have the correct title', async () => {
    await renderComponent()
    expect(screen.getByText('Add To Do Item')).toBeVisible()
  })

  it('should render the AddItemForm component', async () => {
    await renderComponent()
    expect(AddItemForm).toHaveBeenCalled()
  })

  describe('When the back button is clicked', () => {
    it('should navigate back to the to do list page', async () => {
      const navigateSpy = jest.fn()

      jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy)

      renderComponent()

      await act(async () => {
        screen.getByLabelText('Back Button').click()
      })

      expect(navigateSpy).toHaveBeenCalledWith('/todo')
    })
  })

  describe('When the form is submitted', () => {
    it('should create a new to do item', async () => {
      let onSubmitCallback: any;

      jest.mocked(AddItemForm).mockImplementation(({ onSubmit }) => {
        onSubmitCallback = onSubmit;
        return <div>AddItemForm</div>
      })

      renderComponent()

      await act(async () => {
        onSubmitCallback([
          {
            name: 'Name',
            type: FormFieldType.TEXT,
            required: true,
            value: 'Test',
          },
          {
            name: 'Description',
            type: FormFieldType.TEXT,
            required: true,
            value: 'Test',
          },
        ])
      })

      expect(addTodoItem).toHaveBeenCalledWith({
        name: 'Test',
        description: 'Test',
      })  
    })

    describe('And the createToDoItem call succeeds', () => {
      it('should navigate to the to do list page', async () => {
        const navigateSpy = jest.fn()

        jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy)

        let onSubmitCallback: any;

        jest.mocked(AddItemForm).mockImplementation(({ onSubmit }) => {
          onSubmitCallback = onSubmit;
          return <div>AddItemForm</div>
        })

        renderComponent()
        await act(async () => {
          onSubmitCallback([
            {
              name: 'Name',
              type: FormFieldType.TEXT,
              required: true,
              value: 'Test',
            },
            {
              name: 'Description',
              type: FormFieldType.TEXT,
              required: true,
              value: 'Test',
            },
          ])
        })

        expect(navigateSpy).toHaveBeenCalledWith('/todo')
      })
    })

    describe('And the createToDoItem call fails', () => {
      it('should log the error', async () => {
        const consoleSpy = jest.spyOn(console, 'error')
        let onSubmitCallback: any;

        jest.mocked(AddItemForm).mockImplementation(({ onSubmit }) => {
          onSubmitCallback = onSubmit;
          return <div>AddItemForm</div>
        })

        jest.mocked(addTodoItem).mockRejectedValue(new Error('Error creating to do item'))
        
        renderComponent()
        await act(async () => {
          onSubmitCallback([
            {
              name: 'Name',
              type: FormFieldType.TEXT,
              required: true,
              value: 'Test',
            },
            {
              name: 'Description',
              type: FormFieldType.TEXT,
              required: true,
              value: 'Test',
            },
          ])
        })

        expect(consoleSpy).toHaveBeenCalledWith(new Error('Error creating to do item'))
      })
    })
  })
})

const renderComponent = () => {
  render(
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <BrowserRouter>
          <AddToDoItemRoute />
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  )
}
