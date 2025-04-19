import { render, screen } from "@testing-library/react"
import Alert from "."

jest.useFakeTimers()

describe("Given the Alert component", () => {
  it("should render the description", () => {
    renderComponent()

    expect(screen.getByText("alert description")).toBeVisible()
  })

  it("should render the correct severity icon", () => {
    renderComponent()

    expect(screen.getByTestId("SuccessOutlinedIcon")).toBeVisible()
  })

  it("should call the onClose function when the close button is clicked", () => {
    const { onCloseSpy } = renderComponent()

    screen.getByRole("button").click()

    expect(onCloseSpy).toHaveBeenCalled()
  })

  describe("When 3000ms have passed", () => {
    describe("And the alert has not been closed", () => {
      it("should call the onClose function", () => {
        const { onCloseSpy } = renderComponent()

        jest.advanceTimersByTime(3000)

        expect(onCloseSpy).toHaveBeenCalled()
      })
    })

    describe("And the alert has been closed", () => {
      it("should not call the onClose function", () => {
        const { onCloseSpy } = renderComponent()

        screen.getByRole("button").click()
        jest.clearAllMocks()
        jest.advanceTimersByTime(3000)

        expect(onCloseSpy).not.toHaveBeenCalled()
      })
    })
  })
})

const renderComponent = () => {
  const onCloseSpy = jest.fn()
  const component = render(
    <Alert 
      description="alert description" 
      severity="success" 
      onClose={onCloseSpy}
    />
  )

  return {
    component,
    onCloseSpy,
  }
}