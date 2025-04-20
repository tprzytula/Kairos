import { Container, Content } from './index.styled'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import { IStandardLayoutProps } from './types'

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