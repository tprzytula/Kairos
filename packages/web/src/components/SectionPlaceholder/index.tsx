import {
  SectionHeaderPlaceholder,
  SectionLeftContainer,
  SectionRightContainer,
  SectionIconPlaceholder,
  SectionTitlePlaceholder,
  SectionCountPlaceholder,
  ChevronPlaceholder,
} from './index.styled';

const SectionPlaceholder = () => (
  <SectionHeaderPlaceholder>
    <SectionLeftContainer>
      <SectionIconPlaceholder />
      <SectionTitlePlaceholder />
    </SectionLeftContainer>
    <SectionRightContainer>
      <SectionCountPlaceholder />
      <ChevronPlaceholder />
    </SectionRightContainer>
  </SectionHeaderPlaceholder>
);

export default SectionPlaceholder;
