import { IconButton, Tooltip } from '@mui/material'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess'
import { Container, LeftSection, CenterSection, RightSection, ActionButton, StatusText } from './index.styled'
import { IActionButtonsBarProps } from './types'

export const ActionButtonsBar = ({ 
  expandCollapseButton, 
  actionButton, 
  viewToggleButton 
}: IActionButtonsBarProps) => {
  return (
    <Container>
      <LeftSection>
        {expandCollapseButton && (
          <Tooltip title={expandCollapseButton.isExpanded ? 'Collapse all' : 'Expand all'}>
            <IconButton
              aria-label={expandCollapseButton.isExpanded ? 'Collapse all' : 'Expand all'}
              onClick={expandCollapseButton.onToggle}
              size="small"
              disabled={expandCollapseButton.disabled}
            >
              {expandCollapseButton.isExpanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
            </IconButton>
          </Tooltip>
        )}
      </LeftSection>
      
      <CenterSection>
        {actionButton && (
          actionButton.isEnabled ? (
            <ActionButton
              variant="contained"
              color="primary"
              onClick={actionButton.onClick}
              disabled={actionButton.disabled}
              aria-label={typeof actionButton.children === 'string' ? actionButton.children : 'Action button'}
            >
              {actionButton.children}
            </ActionButton>
          ) : (
            <StatusText>
              {actionButton.statusText}
            </StatusText>
          )
        )}
      </CenterSection>
      
      <RightSection>
        {viewToggleButton && (
          <IconButton
            onClick={viewToggleButton.onClick}
            size="large"
            disabled={viewToggleButton.disabled}
            aria-label="Toggle view mode"
          >
            {viewToggleButton.children}
          </IconButton>
        )}
      </RightSection>
    </Container>
  )
}

export default ActionButtonsBar
