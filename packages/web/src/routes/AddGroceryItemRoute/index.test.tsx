import { act, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import { Route } from '../../enums/route'
import AddGroceryItemRoute from '.'
import * as ReactRouter from 'react-router'
import AddItemForm from '../../components/AddItemForm'
import { addGroceryItem } from '../../api/groceryList'
import { FormFieldType } from '../../components/AddItemForm/enums'
import { GroceryItemUnit } from '../../enums/groceryItem'

jest.mock('../../api/groceryList');
jest.mock('../../components/AddItemForm');
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(() => jest.fn()),
}))

describe('Given the AddGroceryItemRoute component', () => {
  it('should have the correct title', async () => {
    await renderComponent()
    expect(screen.getByText('Add Grocery Item')).toBeVisible()
  })

  it('should render the AddItemForm component', async () => {
    await renderComponent()
    expect(AddItemForm).toHaveBeenCalled()
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
          {
            name: 'GroceryItemUnit',
            type: FormFieldType.SELECT,
            required: true,
            value: 'kg',
          },
        ])
      })

      expect(addGroceryItem).toHaveBeenCalledWith({
        name: 'Test',
        quantity: 1,
        unit: GroceryItemUnit.KILOGRAM,
      })  
    })

    describe('And the createGroceryItem call succeeds', () => {
      it('should navigate to the grocery list page', async () => {
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
              name: 'Quantity',
              type: FormFieldType.NUMBER,
              required: true,
              value: 1,
            },
            {
              name: 'GroceryItemUnit',
              type: FormFieldType.SELECT,
              required: true,
              value: 'kg',
            },
          ])
        })

        expect(navigateSpy).toHaveBeenCalledWith(Route.GroceryList)
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

        jest.mocked(addGroceryItem).mockRejectedValue(new Error('Error creating grocery item'))
        
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
            {
              name: 'GroceryItemUnit',
              type: FormFieldType.SELECT,
              required: true,
              value: 'kg',
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