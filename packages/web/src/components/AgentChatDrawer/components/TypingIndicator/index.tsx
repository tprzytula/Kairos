import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import { Wrapper, Avatar, Bubble, Dot } from './index.styled'

const TypingIndicator = () => (
  <Wrapper>
    <Avatar>
      <SmartToyOutlinedIcon sx={{ fontSize: '16px' }} />
    </Avatar>
    <Bubble>
      <Dot delay={0} />
      <Dot delay={200} />
      <Dot delay={400} />
    </Bubble>
  </Wrapper>
)

export default TypingIndicator
