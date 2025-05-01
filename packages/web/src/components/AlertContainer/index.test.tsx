import { render, screen } from "@testing-library/react"
import AlertContainer from "."
import { useAppState } from "../../providers/AppStateProvider"
import { Context } from "../../providers/AppStateProvider/types"
import { IAlert } from "../Alert/types";
import { hideAlert } from "../../utils/alert";

jest.mock('../../providers/AppStateProvider');
jest.mock('../../utils/alert');

describe('Given the AlertContainer component', () => {
    describe('When there are no alerts', () => {
        it('should not render alerts', () => {
            mockUseAppState(new Map())
            renderComponent()

            expect(screen.getByLabelText('Alert Container')).toBeEmptyDOMElement()
        })
    })

    describe('When there are alerts', () => {
        it('should render alerts', () => {
            mockUseAppState(new Map([
                [EXAMPLE_ALERT.id, EXAMPLE_ALERT],
                [EXAMPLE_ALERT_2.id, EXAMPLE_ALERT_2]
            ]))
            renderComponent()

            expect(screen.getByText(EXAMPLE_ALERT.description)).toBeVisible()
            expect(screen.getByText(EXAMPLE_ALERT_2.description)).toBeVisible()
        })

        describe('And an alert is closed', () => {
            it('should call the hideAlert function', () => {
                const dispatchMock = mockUseAppState(new Map([
                    [EXAMPLE_ALERT.id, EXAMPLE_ALERT],
                ]))

                renderComponent()

                screen.getByRole('button', { name: 'Close' }).click()

                expect(hideAlert).toHaveBeenCalledWith(EXAMPLE_ALERT.id, dispatchMock)
            })
        })
    })
})

const mockUseAppState = (alerts: Map<string, IAlert>) => {
    const dispatchMock = jest.fn()

    jest.mocked(useAppState).mockReturnValue({
        state: {
            alerts
        },
        dispatch: dispatchMock
    } as unknown as Context)

    return dispatchMock
}

const renderComponent = () => {
    return render(<AlertContainer />)
}

const EXAMPLE_ALERT: IAlert = {
    id: '1',
    description: 'Test',
    severity: 'success'
}

const EXAMPLE_ALERT_2: IAlert = {
    id: '2',
    description: 'Test 2',
    severity: 'error'
}
