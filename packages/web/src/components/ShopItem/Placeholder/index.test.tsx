import { render, screen } from '@testing-library/react'
import ShopItemPlaceholder from '.'

describe('Given the ShopItemPlaceholder component', () => {
  describe('When rendering the placeholder', () => {
    it('should display the shop item placeholder container', () => {
      render(<ShopItemPlaceholder />)

      expect(screen.getByLabelText('Shop item placeholder')).toBeInTheDocument()
    })

    it('should render skeleton elements for media and content', () => {
      const { container } = render(<ShopItemPlaceholder />)
      
      const skeletonElements = container.querySelectorAll('.MuiSkeleton-root')
      expect(skeletonElements).toHaveLength(3)
    })

    it('should have the correct structure with action area', () => {
      const { container } = render(<ShopItemPlaceholder />)
      
      const actionArea = container.querySelector('.MuiCardActionArea-root')
      expect(actionArea).toBeInTheDocument()
    })

    it('should maintain the same layout as the actual ShopItem component', () => {
      const { container } = render(<ShopItemPlaceholder />)
      
      const containerDiv = container.firstChild
      expect(containerDiv).toHaveClass('MuiCard-root')
      expect(containerDiv).toHaveStyle({
        display: 'flex',
        width: '100%',
        minHeight: '72px',
      })
    })
  })
})
