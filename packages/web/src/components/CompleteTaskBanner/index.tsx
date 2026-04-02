import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { BannerWrapper } from './index.styled'
import { CompleteTaskBannerProps } from './types'

const CompleteTaskBanner = ({ onClick, compact }: CompleteTaskBannerProps): React.ReactElement => {
  const handleClick = (e: React.MouseEvent): void => {
    e.stopPropagation()
    onClick()
  }

  return (
    <BannerWrapper $compact={compact} onClick={handleClick}>
      <CheckCircleIcon />
      All steps done — complete this task?
    </BannerWrapper>
  )
}

export default CompleteTaskBanner
