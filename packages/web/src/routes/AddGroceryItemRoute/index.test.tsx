import { act, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import AddGroceryItemRoute from '.'
import * as ReactRouter from 'react-router'
import AddItemForm from '../../components/AddItemForm'
import { createGroceryItem } from '../../api'
import { FormFieldType } from '../../components/AddItemForm/enums'
jest.mock('../../api');
jest.mock('../../components/AddItemForm');

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}))

describe('Given the AddGroceryItemRoute component', () => {
  it('should have the correct title', () => {
    renderComponent()
    expect(screen.getByText('Add Grocery Item')).toBeVisible()
  })

  it('should render the AddItemForm component', () => {
    renderComponent()
    expect(AddItemForm).toHaveBeenCalled()
  })

  describe('When the back button is clicked', () => {
    it('should navigate back to the grocery list page', async () => {
      const navigateSpy = jest.fn()

      jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy)

      renderComponent()

      await act(async () => {
        screen.getByLabelText('Back Button').click()
      })

      expect(navigateSpy).toHaveBeenCalledWith('/groceries')
    })
  })

  describe('When the form is submitted', () => {
    it('should create a new grocery item', async () => {
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
            name: 'Quantity',
            type: FormFieldType.NUMBER,
            required: true,
            value: 1,
          },
        ])
      })

      expect(createGroceryItem).toHaveBeenCalledWith({
        name: 'Test',
        quantity: 1,
      })
    })

    it('should log the item', async () => {
      const consoleSpy = jest.spyOn(console, 'log')
      let onSubmitCallback: any;

      jest.mocked(AddItemForm).mockImplementation(({ onSubmit }) => {
        onSubmitCallback = onSubmit;
        return <div>AddItemForm</div>
      })

      jest.mocked(createGroceryItem).mockResolvedValue({
        id: '1',
        name: 'Test',
        quantity: 1,
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
            name: 'Quantity',
            type: FormFieldType.NUMBER,
            required: true,
            value: 1,
          },
        ])
      })

      expect(consoleSpy).toHaveBeenCalledWith({
        id: '1',
        name: 'Test',
        quantity: 1,
      })
    })

    describe('And the createGroceryItem call fails', () => {
      it('should log the error', async () => {
        const consoleSpy = jest.spyOn(console, 'error')
        let onSubmitCallback: any;

        jest.mocked(AddItemForm).mockImplementation(({ onSubmit }) => {
          onSubmitCallback = onSubmit;
          return <div>AddItemForm</div>
        })

        jest.mocked(createGroceryItem).mockRejectedValue(new Error('Error creating grocery item'))
        
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
              name: 'Quantity',
              type: FormFieldType.NUMBER,
              required: true,
              value: 1,
            },
          ])
        })

        expect(consoleSpy).toHaveBeenCalledWith(new Error('Error creating grocery item'))
      })
    })
  })
})

const renderComponent = () => {
  render(
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <BrowserRouter>
          <AddGroceryItemRoute />
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  )
}