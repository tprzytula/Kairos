import { render, screen } from "@testing-library/react"
import NoiseTrackingList from "."
import * as NoiseTrackingProvider from "../../providers/NoiseTrackingProvider"
import { IState } from "../../providers/NoiseTrackingProvider/types"

describe('Given the NoiseTrackingList component', () => {
  it('should render the noise tracking list', () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue(EXAMPLE_NOISE_TRACKING_CONTEXT)

    render(<NoiseTrackingList />)

    expect(screen.getByText('25 April 2024 at 01:00')).toBeVisible()
    expect(screen.getByText('26 June 2027 at 10:46')).toBeVisible()
  })
})

const EXAMPLE_NOISE_TRACKING_CONTEXT: IState = {
  noiseTrackingItems: [
    {
      timestamp: 1714003200000,
    },
    {
      timestamp: 1814003200000,
    },
  ],
  isLoading: false,
  refetchNoiseTrackingItems: jest.fn(),
}
