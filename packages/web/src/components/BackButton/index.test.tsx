import { screen, render, act } from '@testing-library/react'
import BackButton from '.'
import * as ReactRouter from 'react-router'

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}))

describe('Given the BackButton component', () => {
  it('should render the button', () => {
    renderBackButton('/my/route')

    expect(screen.getByLabelText('Back Button')).toBeVisible()
  })

  describe('When clicks on the button', () => {
    it('should change to the given route', async () => {
      const navigateSpy = jest.fn()

      jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy)

      renderBackButton('/my/route')

      await act(async () => {
        screen.getByLabelText('Back Button').click()
      })

      expect(navigateSpy).toHaveBeenCalledWith('/my/route')
    })
  })
})

const renderBackButton = (route: string) => {
    render(<BackButton route={route} />)
  }