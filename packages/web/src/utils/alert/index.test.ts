import { hideAlert, showAlert } from "."
import { ActionName } from "../../providers/AppStateProvider/enums"
import { IAlertPayload } from "../../components/Alert/types"

describe('Given the hideAlert function', () => {
  it('should call the dispatch function with the correct action', () => {
    const dispatch = jest.fn()
    const id = '123'

    hideAlert(id, dispatch)

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionName.HIDE_ALERT,
      payload: { id },
    })
  })
})

describe('Given the showAlert function', () => {
  it('should call the dispatch function with the correct action', () => {
    const dispatch = jest.fn()
    const alert: IAlertPayload = {
      description: 'Test',
      severity: 'success',
    }

    showAlert(alert, dispatch)

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionName.SHOW_ALERT,
      payload: {
        id: 'random-uuid',
        ...alert,
      },
    })
  })
})
