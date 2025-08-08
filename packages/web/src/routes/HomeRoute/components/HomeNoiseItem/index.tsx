import { NoiseItem, TimeElapsed } from './index.styled'
import { IHomeNoiseItemProps } from './types'

const HomeNoiseItem = ({ item, timeFormatted, timeElapsed }: IHomeNoiseItemProps) => {
  return (
    <NoiseItem>
      <span>{timeFormatted}</span>
      <TimeElapsed>{timeElapsed}</TimeElapsed>
    </NoiseItem>
  )
}

export default HomeNoiseItem