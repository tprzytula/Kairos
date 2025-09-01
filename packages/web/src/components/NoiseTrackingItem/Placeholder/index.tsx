import { Container, Content, TimeContainer, TimeIcon, AbsoluteTime, RelativeTime } from './index.styled';

const NoiseTrackingItemPlaceholder = () => {
  return (
    <Container aria-label="Noise tracking item placeholder">
      <Content>
        <TimeContainer>
          <TimeIcon />
          <AbsoluteTime />
        </TimeContainer>
        <RelativeTime />
      </Content>
    </Container>
  );
};

export default NoiseTrackingItemPlaceholder;