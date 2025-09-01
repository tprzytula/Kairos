import { useNoiseTrackingContext } from '../../providers/NoiseTrackingProvider';
import { Container } from './index.styled';
import SimpleView from './SimpleView';
import GroupedView from './GroupedView';
import Placeholder from './Placeholder';
import EmptyNoiseTrackingList from './EmptyNoiseTrackingList';
import { INoiseTrackingListProps, ViewMode } from './types';

const NoiseTrackingList = ({
  viewMode,
  allExpanded,
  expandKey
}: INoiseTrackingListProps) => {
  const { noiseTrackingItems, isLoading } = useNoiseTrackingContext();

  if (isLoading) {
    return <Placeholder />
  }

  if (noiseTrackingItems.length === 0) {
    return (
      <Container>
        <EmptyNoiseTrackingList />
      </Container>
    );
  }

  if (viewMode === ViewMode.Simple) {
    return (
      <Container>
        <SimpleView 
          noiseTrackingItems={noiseTrackingItems}
          allExpanded={allExpanded}
          expandKey={expandKey}
        />
      </Container>
    );
  }

  return (
    <Container>
      <GroupedView 
        noiseTrackingItems={noiseTrackingItems}
        allExpanded={allExpanded}
        expandKey={expandKey}
      />
    </Container>
  );
};

export default NoiseTrackingList;
