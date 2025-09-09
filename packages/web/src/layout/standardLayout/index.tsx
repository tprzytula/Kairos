import { Container, Content } from './index.styled'
import { IStandardLayoutProps } from './types'
import NavigationBar from '../../components/NavigationBar'

const StandardLayout = ({
  children,
  centerVertically = false,
}: IStandardLayoutProps) => {
  return (
    <Container>
      <Content centerVertically={centerVertically}>
        {children}
      </Content>
      <NavigationBar />
    </Container>
  )
}

export default StandardLayout;