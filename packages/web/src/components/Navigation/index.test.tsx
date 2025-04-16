import { screen, render, act } from '@testing-library/react'
import Navigation from '.'
import * as ReactRouter from 'react-router'
import { ReactNode } from 'react'

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}))

describe('Given the BackButton component', () => {
  it('should render the button', () => {
    renderNavigation('/my/route')

    expect(screen.getByLabelText('Back Button')).toBeVisible()
  })

  describe('When clicks on the button', () => {
    it('should change to the given route', async () => {
      const navigateSpy = jest.fn()

      jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy)

      renderNavigation('/my/route')

      await act(async () => {
        screen.getByLabelText('Back Button').click()
      })

      expect(navigateSpy).toHaveBeenCalledWith('/my/route')
    })
  })
})

const renderNavigation = (previousRoute: string, actionButton?: ReactNode) => {
    render(<Navigation previousRoute={previousRoute} actionButton={actionButton} />)
  }
  