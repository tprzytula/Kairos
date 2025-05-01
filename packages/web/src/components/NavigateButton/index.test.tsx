import { screen, render } from '@testing-library/react'
import * as ReactRouter from 'react-router'
import NavigateButton from '.'

const { BrowserRouter } = ReactRouter;

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));

describe('Given the NavigateButton component', () => {
  it('should render the name', () => {
    render(
      <BrowserRouter>
        <NavigateButton ariaLabel="Navigate" route="/my/route" />
      </BrowserRouter>
    )

    expect(screen.getByLabelText('Navigate')).toBeVisible()
  })

  describe('When the navigate icon is pressed', () => {
    it('should change view to /groceries/add', () => {
      const navigateSpy = jest.fn()
      
      jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy)

      render(
        <BrowserRouter>
          <NavigateButton ariaLabel="Navigate" route="/my/route" />
        </BrowserRouter>
      )

      screen.getByLabelText('Navigate').click()

      expect(navigateSpy).toHaveBeenCalledWith('/my/route')
    })
  })
})