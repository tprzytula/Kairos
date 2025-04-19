import { StyledAlert } from "./index.styled"
import { IAlertProps } from "./types"
import { useEffect, useCallback, useRef } from "react"

const AUTO_DISMISS_DELAY = 3000

const Alert = ({ description, severity, onClose }: IAlertProps) => {
    const timeoutRef = useRef<number | null>(null)

    const clearTimeout = useCallback(() => {
        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }, [])

    const handleClose = useCallback(() => {
        clearTimeout()
        onClose()
    }, [onClose, clearTimeout])

    const createTimeout = useCallback(() => {
        clearTimeout()
        timeoutRef.current = window.setTimeout(handleClose, AUTO_DISMISS_DELAY)
    }, [handleClose, clearTimeout])

    useEffect(() => {
        createTimeout()
        return clearTimeout
    }, [createTimeout, clearTimeout])

    return (
        <StyledAlert 
            variant="filled" 
            severity={severity} 
            onClose={handleClose}
            role="alert"
            aria-live="polite"
        >
            {description}
        </StyledAlert>
    )
}

export default Alert
