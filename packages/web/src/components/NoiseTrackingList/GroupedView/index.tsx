import NoiseTrackingItem from '../../NoiseTrackingItem';
import CollapsibleSection from '../../CollapsibleSection';
import SwipeableList from '../../SwipeableList';
import { Container, MiniTimeline, TimelineBar } from './index.styled';
import { IGroupedViewProps } from './types';
import { SectionIcon } from '../../CollapsibleSection/types';

const transformNoiseItems = (items: { timestamp: number }[]) => {
  return items.map(item => ({
    ...item,
    id: item.timestamp.toString()
  }));
};

const getDayStats = (items: { timestamp: number }[]) => {
  if (items.length === 0) return { peakHour: 0, hourlyDistribution: [], maxCount: 0 };
  
  const filteredItems = items.filter(item => {
    const hour = new Date(item.timestamp).getHours();
    return hour >= 7 && hour <= 23;
  });
  
  if (filteredItems.length === 0) return { peakHour: 0, hourlyDistribution: [], maxCount: 0 };
  
  const hourCounts = new Map<number, number>();
  filteredItems.forEach(item => {
    const hour = new Date(item.timestamp).getHours();
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
  });
  
  let peakHour = 7;
  let maxCount = 0;
  hourCounts.forEach((count, hour) => {
    if (count > maxCount) {
      maxCount = count;
      peakHour = hour;
    }
  });
  
  const hourlyDistribution = Array.from({ length: 9 }, (_, period) => {
    if (period === 8) {
      return hourCounts.get(23) || 0;
    } else {
      const startHour = 7 + (period * 2);
      const endHour = startHour + 1;
      return (hourCounts.get(startHour) || 0) + (hourCounts.get(endHour) || 0);
    }
  });
  
  return { peakHour, hourlyDistribution, maxCount };
};

const getMiniTimelineData = (hourlyDistribution: number[], maxCount: number) => {
  const maxHeight = 12;
  return hourlyDistribution.map(count => ({
    height: maxCount > 0 ? Math.max(2, (count / maxCount) * maxHeight) : 2,
    hasData: count > 0
  }));
};

const MiniTimelineComponent = ({ items }: { items: { timestamp: number }[] }) => {
  if (items.length === 0) return null;
  
  const { hourlyDistribution, maxCount } = getDayStats(items);
  const timelineData = getMiniTimelineData(hourlyDistribution, maxCount);
  
  return (
    <MiniTimeline>
      {timelineData.map((bar, index) => (
        <TimelineBar 
          key={index} 
          height={bar.height}
          color={bar.hasData ? undefined : 'rgba(0, 0, 0, 0.1)'}
          aria-label="Timeline bar"
        />
      ))}
    </MiniTimeline>
  );
};

const groupByDate = (items: { timestamp: number }[]) => {
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

const DATE_ICON_MAP: Record<string, SectionIcon> = {
  'Today': { emoji: '📅', backgroundColor: '#ecfdf5', foregroundColor: '#059669' },
  'Yesterday': { emoji: '📆', backgroundColor: '#eff6ff', foregroundColor: '#2563eb' },
  'default': { emoji: '🗓️', backgroundColor: '#f8fafc', foregroundColor: '#64748b' },
};

const getDateIcon = (dateLabel: string): SectionIcon => {
  return DATE_ICON_MAP[dateLabel] || DATE_ICON_MAP.default;
};

const GroupedView = ({ 
  noiseTrackingItems, 
  allExpanded, 
  expandKey 
}: IGroupedViewProps) => {
  const groupedItems = groupByDate(noiseTrackingItems);

  return (
    <Container>
      {groupedItems.map(({ date, items }) => {
        const dateLabel = getDateLabel(date);
        
        return (
          <CollapsibleSection
            key={date}
            title={dateLabel}
            icon={getDateIcon(dateLabel)}
            items={items}
            expandTo={allExpanded}
            expandKey={expandKey}
            headerRightContent={<MiniTimelineComponent items={items} />}
          >
            <SwipeableList
              component={NoiseTrackingItem}
              list={transformNoiseItems(items)}
              threshold={0.3}
            />
          </CollapsibleSection>
        );
      })}
    </Container>
  );
};

export default GroupedView;
