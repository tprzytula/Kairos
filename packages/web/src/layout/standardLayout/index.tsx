import { Container, Content } from './index.styled'
import { IStandardLayoutProps } from './types'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'

const StandardLayout = ({
  title,
  children,
  previousRoute,
  nextRoute,
}: IStandardLayoutProps) => {
  return (
    <Container>
      <Header title={title} />
      <Content>
        {children}
      </Content>
      <Navigation
        previousRoute={previousRoute}
        nextRoute={nextRoute}
      />
    </Container>
  )
}

export default StandardLayout;