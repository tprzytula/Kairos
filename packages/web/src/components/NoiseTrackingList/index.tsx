import { useState, useEffect } from 'react';
import { useNoiseTrackingContext } from '../../providers/NoiseTrackingProvider';
import { Container, ScrollableList, DateGroup, DateHeader, DateHeaderContent, ItemCount, StatsContainer, PeakTime, MiniTimeline, TimelineBar, ExpandIcon, CollapsibleContent, ViewToggleContainer, ViewToggleButton, SimpleListContainer, SimpleListItem } from './index.styled';
import EmptyState from '../EmptyState';
import NoiseTrackingItem from '../NoiseTrackingItem';
import NoiseTrackingItemPlaceholder from '../NoiseTrackingItemPlaceholder';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';

const groupByDate = (items: { timestamp: number }[]) => {
  // Filter items to only include those between 7am and midnight (7-23) 
  const filteredItems = items.filter(item => {
    const hour = new Date(item.timestamp).getHours();
    return hour >= 7 && hour <= 23;
  });
  
  const groups = new Map<string, { timestamp: number }[]>();
  
  filteredItems.forEach(item => {
    const date = new Date(item.timestamp);
    const dateKey = date.toDateString();
    
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(item);
  });
  
  return Array.from(groups.entries()).map(([dateKey, items]) => ({
    date: dateKey,
    items: items.sort((a, b) => b.timestamp - a.timestamp)
  }));
};

const getDateLabel = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    const dayName = date.toLocaleDateString('en-GB', { weekday: 'long' });
    const dateOnly = date.toLocaleDateString('en-GB', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return `${dateOnly} • ${dayName}`;
  }
};

const getDayStats = (items: { timestamp: number }[]) => {
  if (items.length === 0) return { peakHour: 0, hourlyDistribution: [], maxCount: 0 };
  
  // Filter items to only include those between 7am and midnight (7-23)
  const filteredItems = items.filter(item => {
    const hour = new Date(item.timestamp).getHours();
    return hour >= 7 && hour <= 23;
  });
  
  if (filteredItems.length === 0) return { peakHour: 0, hourlyDistribution: [], maxCount: 0 };
  
  // Group by hour (only 7am to 11pm)
  const hourCounts = new Map<number, number>();
  filteredItems.forEach(item => {
    const hour = new Date(item.timestamp).getHours();
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
  });
  
  // Find peak hour
  let peakHour = 7;
  let maxCount = 0;
  hourCounts.forEach((count, hour) => {
    if (count > maxCount) {
      maxCount = count;
      peakHour = hour;
    }
  });
  
  // Create 9-period distribution for mini timeline covering 7am-11pm (17 hours in ~2-hour blocks)
  // 7-8, 9-10, 11-12, 13-14, 15-16, 17-18, 19-20, 21-22, 23
  const hourlyDistribution = Array.from({ length: 9 }, (_, period) => {
    if (period === 8) {
      // Last period only covers hour 23
      return hourCounts.get(23) || 0;
    } else {
      const startHour = 7 + (period * 2);
      const endHour = startHour + 1;
      return (hourCounts.get(startHour) || 0) + (hourCounts.get(endHour) || 0);
    }
  });
  
  return { peakHour, hourlyDistribution, maxCount };
};

const formatPeakTime = (hour: number) => {
  if (hour === 0) return '12am';
  if (hour < 12) return `${hour}am`;
  if (hour === 12) return '12pm';
  return `${hour - 12}pm`;
};

const getMiniTimelineData = (hourlyDistribution: number[], maxCount: number) => {
  const maxHeight = 12;
  return hourlyDistribution.map(count => ({
    height: maxCount > 0 ? Math.max(2, (count / maxCount) * maxHeight) : 2,
    hasData: count > 0
  }));
};



const PlaceholderComponent = () => (
  <Container>
    <ScrollableList data-testid="noise-tracking-placeholders">
      {Array.from({ length: 8 }).map((_, index) => (
        <NoiseTrackingItemPlaceholder key={index} />
      ))}
    </ScrollableList>
  </Container>
)

const formatTimestampForSimpleView = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (dateOnly.getTime() === today.getTime()) {
    return `Today, ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (dateOnly.getTime() === yesterday.getTime()) {
    return `Yesterday, ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleString('en-GB', { 
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

const NoiseTrackingList = () => {
  const { noiseTrackingItems, isLoading } = useNoiseTrackingContext();
  
  // View mode state: 'grouped' or 'simple'
  const [viewMode, setViewMode] = useState<'grouped' | 'simple'>('grouped');
  
  // Get the first two date groups to expand by default
  const groupedItems = groupByDate(noiseTrackingItems);
  
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  // Update expanded groups when data loads (only once)
  useEffect(() => {
    if (!isLoading && noiseTrackingItems.length > 0 && expandedGroups.size === 0) {
      const defaultExpanded = groupedItems.slice(0, 2).map(({ date }) => getDateLabel(date));
      setExpandedGroups(new Set(defaultExpanded));
    }
  }, [isLoading, noiseTrackingItems.length]);

  const toggleGroup = (date: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedGroups(newExpanded);
  };

  const expandAllGroups = () => {
    const allGroupLabels = groupedItems.map(({ date }) => getDateLabel(date));
    setExpandedGroups(new Set(allGroupLabels));
  };

  const collapseAllGroups = () => {
    setExpandedGroups(new Set());
  };

  const areAllGroupsExpanded = () => {
    const allGroupLabels = groupedItems.map(({ date }) => getDateLabel(date));
    return allGroupLabels.length > 0 && allGroupLabels.every(label => expandedGroups.has(label));
  };

  if (isLoading) {
    return <PlaceholderComponent />
  }

  if (noiseTrackingItems.length === 0) {
    return (
      <Container>
        <EmptyState 
          icon={<VolumeUpIcon aria-label="No noise events" />}
          title="No noise events recorded yet"
          subtitle="Tap the + button to add your first entry"
        />
      </Container>
    );
  }



  // Filter items for simple view to only show 7am to midnight
  const filteredSortedItems = noiseTrackingItems
    .filter(item => {
      const hour = new Date(item.timestamp).getHours();
      return hour >= 7 && hour <= 23;
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Container>
      <ViewToggleContainer>
        <div style={{ display: 'flex', gap: '8px' }}>
          {viewMode === 'grouped' && groupedItems.length > 0 && (
            <ViewToggleButton
              isActive={false}
              onClick={areAllGroupsExpanded() ? collapseAllGroups : expandAllGroups}
            >
              {areAllGroupsExpanded() ? (
                <UnfoldLessIcon fontSize="small" />
              ) : (
                <UnfoldMoreIcon fontSize="small" />
              )}
            </ViewToggleButton>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <ViewToggleButton
            isActive={viewMode === 'grouped'}
            onClick={() => setViewMode('grouped')}
          >
            <ViewModuleIcon fontSize="small" />
          </ViewToggleButton>
          <ViewToggleButton
            isActive={viewMode === 'simple'}
            onClick={() => setViewMode('simple')}
          >
            <ViewListIcon fontSize="small" />
          </ViewToggleButton>
        </div>
      </ViewToggleContainer>

      {viewMode === 'simple' ? (
        <SimpleListContainer>
          {filteredSortedItems.map(({ timestamp }) => (
            <SimpleListItem key={timestamp}>
              {formatTimestampForSimpleView(timestamp)}
            </SimpleListItem>
          ))}
        </SimpleListContainer>
      ) : (
        <ScrollableList>

          {groupedItems.map(({ date, items }) => {
            const dateLabel = getDateLabel(date);
            const isExpanded = expandedGroups.has(dateLabel);
            const { peakHour, hourlyDistribution, maxCount } = getDayStats(items);
            const timelineData = getMiniTimelineData(hourlyDistribution, maxCount);
            
            return (
              <DateGroup key={date}>
                <DateHeader onClick={() => toggleGroup(dateLabel)}>
                  <DateHeaderContent>
                    {dateLabel}
                    <ItemCount>({items.length})</ItemCount>
                  </DateHeaderContent>
                  <StatsContainer>
                    {items.length >= 1 && (
                      <MiniTimeline>
                        {timelineData.map((bar, index) => (
                          <TimelineBar 
                            key={index} 
                            height={bar.height}
                            color={bar.hasData ? undefined : 'rgba(0, 0, 0, 0.1)'}
                            data-testid="timeline-bar"
                          />
                        ))}
                      </MiniTimeline>
                    )}
                    <ExpandIcon isExpanded={isExpanded}>
                      <ExpandMoreIcon fontSize="small" />
                    </ExpandIcon>
                  </StatsContainer>
                </DateHeader>
                <CollapsibleContent isExpanded={isExpanded}>
                  {items.map(({ timestamp }) => (
                    <NoiseTrackingItem key={timestamp} timestamp={timestamp} />
                  ))}
                </CollapsibleContent>
              </DateGroup>
            );
          })}
        </ScrollableList>
      )}
    </Container>
  );
};

export default NoiseTrackingList;
