import { render, screen } from "@testing-library/react"
import NoiseTrackingItem from "."

describe('Given the NoiseTrackingItem component', () => {
  it('should render the noise tracking item', () => {
    render(<NoiseTrackingItem timestamp={1714003200000} />)

    expect(screen.getByText('25 April 2024 at 01:00')).toBeVisible()
  })
})
