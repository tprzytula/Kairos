import { screen, render } from '@testing-library/react'
import * as ReactRouter from 'react-router'
import AddItemButton from '.'

const { BrowserRouter } = ReactRouter;

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));

describe('Given the AddItemButton component', () => {
  it('should render the name', () => {
    render(
      <BrowserRouter>
        <AddItemButton ariaLabel="Add Item" route="/my/route" />
      </BrowserRouter>
    )

    expect(screen.getByLabelText('Add Item')).toBeVisible()
  })

  describe('When the add icon is pressed', () => {
    it('should change view to /groceries/add', () => {
      const navigateSpy = jest.fn()
      
      jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy)

      render(
        <BrowserRouter>
          <AddItemButton ariaLabel="Add Item" route="/my/route" />
        </BrowserRouter>
      )

      screen.getByLabelText('Add Item').click()

      expect(navigateSpy).toHaveBeenCalledWith('/my/route')
    })
  })
})