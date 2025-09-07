import React from 'react'
import { act, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider } from '../../providers/AppStateProvider'
import { GroceryListProvider } from '../../providers/GroceryListProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import { Route } from '../../enums/route'
import EditGroceryItemRoute from '.'
import * as ReactRouter from 'react-router'
import AddItemForm from '../../components/AddItemForm'
import { FormFieldType } from '../../components/AddItemForm/enums'
import { GroceryItemUnit } from '../../enums/groceryItem'

jest.mock('../../hooks/useItemDefaults', () => ({
  useItemDefaults: () => ({
    defaults: [],
  }),
}))

jest.mock('../../components/AddItemForm');
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(() => jest.fn()),
  useParams: jest.fn(),
}))

const mockGroceryItem = {
  id: '1',
  name: 'Test Item',
  quantity: 2,
  unit: GroceryItemUnit.KILOGRAM,
  imagePath: '/test.png',
  toBeRemoved: false,
}

const mockGroceryListContext = {
  groceryList: [mockGroceryItem],
  isLoading: false,
  refetchGroceryList: jest.fn(),
  removeGroceryItem: jest.fn(),
  updateGroceryItem: jest.fn(),
  updateGroceryItemFields: jest.fn(),
}

jest.mock('../../providers/GroceryListProvider', () => ({
  ...jest.requireActual('../../providers/GroceryListProvider'),
  useGroceryListContext: () => mockGroceryListContext,
}))

describe('Given the EditGroceryItemRoute component', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ id: '1', shopId: 'test-shop-1' })
    jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(mockNavigate)
    mockNavigate.mockClear()
  })

  it('should have the correct title', async () => {
    await renderComponent()
    expect(screen.getByText('Edit Grocery Item')).toBeVisible()
  })

  it('should render the AddItemForm component with prefilled values', async () => {
    await renderComponent()
    
    const [firstCall] = jest.mocked(AddItemForm).mock.calls
    const props = firstCall[0]
    
    expect(props.fields).toHaveLength(3)
    
    const nameField = props.fields.find((field: any) => field.name === 'name')
    const quantityField = props.fields.find((field: any) => field.name === 'quantity')
    const unitField = props.fields.find((field: any) => field.name === 'unit')
    
    expect(nameField).toBeDefined()
    expect(quantityField).toBeDefined()
    expect(unitField).toBeDefined()
    
    expect(nameField!.value).toBe('Test Item')
    expect(quantityField!.value).toBe(2)
    expect(unitField!.value).toBe(GroceryItemUnit.KILOGRAM)
  })



  describe('When the form is submitted', () => {
            it('should call updateGroceryItemFields with the updated values', async () => {
          let onSubmitCallback: any;

          jest.mocked(AddItemForm).mockImplementation(({ onSubmit }) => {
            onSubmitCallback = onSubmit;
            return <div>AddItemForm</div>
          })

          renderComponent()

          await act(async () => {
            onSubmitCallback([
              {
                name: 'name',
                type: FormFieldType.TEXT,
                required: true,
                value: 'Updated Item',
              },
              {
                name: 'quantity',
                type: FormFieldType.NUMBER,
                required: true,
                value: 3,
              },
              {
                name: 'unit',
                type: FormFieldType.SELECT,
                required: true,
                value: GroceryItemUnit.UNIT,
              },
            ])
          })

          expect(mockGroceryListContext.updateGroceryItemFields).toHaveBeenCalledWith('1', {
            name: 'Updated Item',
            quantity: 3,
            unit: GroceryItemUnit.UNIT,
            imagePath: '/test.png',
          })

          expect(mockNavigate).toHaveBeenCalledWith('/groceries/test-shop-1')
        })

    describe('And validation fails', () => {
      it('should log the error', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
        let onSubmitCallback: any;

        jest.mocked(AddItemForm).mockImplementation(({ onSubmit }) => {
          onSubmitCallback = onSubmit;
          return <div>AddItemForm</div>
        })
        
        renderComponent()
        await act(async () => {
          onSubmitCallback([
            {
              name: 'name',
              type: FormFieldType.TEXT,
              required: true,
              value: '',
            },
            {
              name: 'quantity',
              type: FormFieldType.NUMBER,
              required: true,
              value: 1,
            },
          ])
        })

        expect(consoleSpy).toHaveBeenCalledWith(new Error('Invalid number of fields'))
      })
    })
  })
})

const renderComponent = () => {
  render(
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <GroceryListProvider>
          <BrowserRouter>
            <EditGroceryItemRoute />
          </BrowserRouter>
        </GroceryListProvider>
      </AppStateProvider>
    </ThemeProvider>
  )
}