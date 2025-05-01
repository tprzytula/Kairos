import { AlertColor } from "@mui/material"

export interface IAlertPayload {
    description: string
    severity: AlertColor
}

export type IAlert = IAlertPayload & {
    id: string
}

export interface IAlertProps {
    description: string
    severity: AlertColor
    onClose: () => void
}
  