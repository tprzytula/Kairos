import { Mock } from 'vitest'
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

vi.mock('../../api/groceryList');
vi.mock('../../components/ItemForm');
vi.mock('../../hooks/useItemDefaults');
vi.mock('../../providers/GroceryListProvider');
vi.mock('../../providers/ProjectProvider');
vi.mock('../../providers/ShopProvider', async () => ({
  useShopContext: vi.fn(),
}));
vi.mock('../../components/ModernPageHeader', () => ({
  default: ({ title }: any) => <div>{title}</div>
}));
vi.mock('@mui/icons-material/ShoppingCart', () => ({
  default: () => <div>ShoppingCartIcon</div>
}));
vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
  useNavigate: vi.fn(() => vi.fn()),
  useParams: vi.fn(),
}))

describe('Given the AddGroceryItemContent component', () => {
  const mockProject = {
    id: 'test-project-id',
    name: 'Test Project',
    isPersonal: false
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    (useGroceryListContext as Mock).mockReturnValue({
      groceryList: [],
      isLoading: false,
      viewMode: 'CATEGORIZED' as any,
      setViewMode: vi.fn(),
      refetchGroceryList: vi.fn(),
      removeGroceryItem: vi.fn(),
      updateGroceryItem: vi.fn(),
      updateGroceryItemFields: vi.fn(),
    });

    (useProjectContext as Mock).mockReturnValue({
      currentProject: mockProject,
      projects: [mockProject],
      isLoading: false,
      createProject: vi.fn(),
      joinProject: vi.fn(),
      switchProject: vi.fn(),
      fetchProjects: vi.fn(),
      getProjectInviteInfo: vi.fn(),
    });

    vi.spyOn(ReactRouter, 'useParams').mockReturnValue({ shopId: 'test-shop-1' });

    (useItemDefaults as Mock).mockReturnValue({
      defaults: []
    });

    (useShopContext as Mock).mockReturnValue({
      shops: [{ 
        id: 'test-shop-1', 
        name: 'Test Shop',
        projectId: 'test-project-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }],
      isLoading: false,
      currentShop: null,
      fetchShops: vi.fn(),
      addShop: vi.fn(),
      updateShop: vi.fn(),
      deleteShop: vi.fn(),
      setCurrentShop: vi.fn(),
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

      vi.mocked(ItemForm).mockImplementation(({ onSubmit }) => {
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
        const navigateSpy = vi.fn()

        vi.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy)

        let onSubmitCallback: any;

        vi.mocked(ItemForm).mockImplementation(({ onSubmit }) => {
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
        const consoleSpy = vi.spyOn(console, 'error')
        let onSubmitCallback: any;

        vi.mocked(ItemForm).mockImplementation(({ onSubmit }) => {
          onSubmitCallback = onSubmit;
          return <div>ItemForm</div>
        })

        vi.mocked(addGroceryItem).mockRejectedValue(new Error('Error creating grocery item'))
        
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
        (useProjectContext as Mock).mockReturnValue({
          currentProject: null,
          projects: [],
          isLoading: false,
          createProject: vi.fn(),
          joinProject: vi.fn(),
          switchProject: vi.fn(),
          fetchProjects: vi.fn(),
          getProjectInviteInfo: vi.fn(),
        });

        let onSubmitCallback: any;

        vi.mocked(ItemForm).mockImplementation(({ onSubmit }) => {
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