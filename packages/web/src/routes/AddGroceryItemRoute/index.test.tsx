import { act, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import { Route } from '../../enums/route'
import { AddGroceryItemContent } from '.'
import * as ReactRouter from 'react-router'
import ItemForm from '../../components/ItemForm'
import { addGroceryItem } from '../../api/groceryList'
import { FormFieldType } from '../../components/ItemForm/enums'
import { GroceryItemUnit } from '../../enums/groceryItem'
import { useItemDefaults } from '../../hooks/useItemDefaults'
import { useGroceryListContext } from '../../providers/GroceryListProvider'
import { useProjectContext } from '../../providers/ProjectProvider'
import { useShopContext } from '../../providers/ShopProvider'

jest.mock('../../api/groceryList');
jest.mock('../../components/ItemForm');
jest.mock('../../hooks/useItemDefaults');
jest.mock('../../providers/GroceryListProvider');
jest.mock('../../providers/ProjectProvider');
jest.mock('../../providers/ShopProvider', () => ({
  useShopContext: jest.fn(),
}));
jest.mock('../../components/ModernPageHeader', () => ({ title }: any) => <div>{title}</div>);
jest.mock('@mui/icons-material/ShoppingCart', () => () => <div>ShoppingCartIcon</div>);
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(() => jest.fn()),
  useParams: jest.fn(),
}))

describe('Given the AddGroceryItemContent component', () => {
  const mockProject = {
    id: 'test-project-id',
    name: 'Test Project',
    isPersonal: false
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    (useGroceryListContext as jest.Mock).mockReturnValue({
      groceryList: [],
      isLoading: false,
      viewMode: 'CATEGORIZED' as any,
      setViewMode: jest.fn(),
      refetchGroceryList: jest.fn(),
      removeGroceryItem: jest.fn(),
      updateGroceryItem: jest.fn(),
      updateGroceryItemFields: jest.fn(),
    });

    (useProjectContext as jest.Mock).mockReturnValue({
      currentProject: mockProject,
      projects: [mockProject],
      isLoading: false,
      createProject: jest.fn(),
      joinProject: jest.fn(),
      switchProject: jest.fn(),
      fetchProjects: jest.fn(),
      getProjectInviteInfo: jest.fn(),
    });

    jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ shopId: 'test-shop-1' });

    (useItemDefaults as jest.Mock).mockReturnValue({
      defaults: []
    });

    (useShopContext as jest.Mock).mockReturnValue({
      shops: [{ 
        id: 'test-shop-1', 
        name: 'Test Shop',
        projectId: 'test-project-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }],
      isLoading: false,
      currentShop: null,
      fetchShops: jest.fn(),
      addShop: jest.fn(),
      updateShop: jest.fn(),
      deleteShop: jest.fn(),
      setCurrentShop: jest.fn(),
    });
  })

  it('should have the correct title', async () => {
    await renderComponent()
    expect(screen.getByText('Add Item to Test Shop')).toBeVisible()
  })

  it('should render the ItemForm component', async () => {
    await renderComponent()
    expect(ItemForm).toHaveBeenCalled()
  })

  describe('When the form is submitted', () => {
    it('should create a new grocery item', async () => {
      let onSubmitCallback: any;

      jest.mocked(ItemForm).mockImplementation(({ onSubmit }) => {
        onSubmitCallback = onSubmit;
        return <div>ItemForm</div>
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
        shopId: 'test-shop-1',
      }, 'test-project-id')  
    })

    describe('And the createGroceryItem call succeeds', () => {
      it('should navigate to the grocery list page', async () => {
        const navigateSpy = jest.fn()

        jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy)

        let onSubmitCallback: any;

        jest.mocked(ItemForm).mockImplementation(({ onSubmit }) => {
          onSubmitCallback = onSubmit;
          return <div>ItemForm</div>
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

        expect(navigateSpy).toHaveBeenCalledWith('/groceries/test-shop-1')
      })
    })

    describe('And the createGroceryItem call fails', () => {
      it('should log the error', async () => {
        const consoleSpy = jest.spyOn(console, 'error')
        let onSubmitCallback: any;

        jest.mocked(ItemForm).mockImplementation(({ onSubmit }) => {
          onSubmitCallback = onSubmit;
          return <div>ItemForm</div>
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

    describe('And no project is selected', () => {
      it('should show an error alert and not call addGroceryItem', async () => {
        (useProjectContext as jest.Mock).mockReturnValue({
          currentProject: null,
          projects: [],
          isLoading: false,
          createProject: jest.fn(),
          joinProject: jest.fn(),
          switchProject: jest.fn(),
          fetchProjects: jest.fn(),
          getProjectInviteInfo: jest.fn(),
        });

        let onSubmitCallback: any;

        jest.mocked(ItemForm).mockImplementation(({ onSubmit }) => {
          onSubmitCallback = onSubmit;
          return <div>ItemForm</div>
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

        expect(addGroceryItem).not.toHaveBeenCalled()
      })
    })
  })
})

const renderComponent = () => {
  render(
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <BrowserRouter>
          <AddGroceryItemContent />
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  )
}