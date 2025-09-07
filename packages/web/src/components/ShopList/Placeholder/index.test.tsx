import { render, screen } from '@testing-library/react'
import Placeholder from '.'

describe('Given the Placeholder component', () => {
  describe('When rendering with default props', () => {
    it('should display the shops placeholders container', () => {
      render(<Placeholder />)

      expect(screen.getByLabelText('Loading shops')).toBeInTheDocument()
    })

    it('should render the default number of shop placeholders', () => {
      render(<Placeholder />)

      expect(screen.getAllByLabelText('Shop item placeholder')).toHaveLength(4)
    })

    it('should render the container with proper structure', () => {
      const { container } = render(<Placeholder />)

      const containerDiv = container.firstChild
      expect(containerDiv).toBeInTheDocument()
    })
  })

  describe('When rendering with custom numberOfShops', () => {
    it('should render the specified number of shop placeholders', () => {
      render(<Placeholder numberOfShops={6} />)

      expect(screen.getAllByLabelText('Shop item placeholder')).toHaveLength(6)
    })

    it('should still display the placeholders container', () => {
      render(<Placeholder numberOfShops={2} />)

      expect(screen.getByLabelText('Loading shops')).toBeInTheDocument()
    })
  })

  describe('When rendering with zero shops', () => {
    it('should render without errors', () => {
      render(<Placeholder numberOfShops={0} />)

      expect(screen.getByLabelText('Loading shops')).toBeInTheDocument()
      expect(screen.queryAllByLabelText('Shop item placeholder')).toHaveLength(0)
    })
  })
})
