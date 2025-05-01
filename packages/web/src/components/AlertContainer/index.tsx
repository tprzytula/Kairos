import { Container } from "./index.styled"
import Alert from "../Alert"
import { useAppState } from "../../providers/AppStateProvider"
import { useCallback, useMemo } from "react"
import { hideAlert } from "../../utils/alert"
import { IAlert } from "../Alert/types"

const AlertContainer = () => {
  const { state: { alerts }, dispatch } = useAppState()

  const onClose = useCallback(
    (id: string) => {
      hideAlert(id, dispatch)
    },
    [dispatch]
  )

  const renderAlert = useCallback(
    ({ id, description, severity }: IAlert) => (
      <Alert
        key={id}
        description={description}
        severity={severity}
        onClose={() => onClose(id)}
      />
    ),
    [onClose]
  )

  const alertList = useMemo(
    () => Array.from(alerts.values()).map(renderAlert),
    [alerts, renderAlert]
  )

  return (
    <Container aria-label="Alert Container">
      {alertList}
    </Container>
  )
}

export default AlertContainer