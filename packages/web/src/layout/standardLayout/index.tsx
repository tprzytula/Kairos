import { Container, Content } from './index.styled'
import { IStandardLayoutProps } from './types'
import Header from '../../components/Header'
import NavigationBar from '../../components/NavigationBar'

const StandardLayout = ({
  title,
  children,
  centerVertically = false,
}: IStandardLayoutProps) => {
  return (
    <Container>
      <Header title={title} />
      <Content centerVertically={centerVertically}>
        {children}
      </Content>
      <NavigationBar />
    </Container>
  )
}

export default StandardLayout;