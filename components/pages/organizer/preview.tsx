import styled from '@emotion/styled';
import { contentGrid, mq } from '../../globals/Constants';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { Breakpoint } from '../../../lib/WindowService';
import { Organizer } from '../../../lib/api/types/organizer';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { useLanguage } from '../../../lib/routing';
import { getTranslation } from '../../../lib/translations';

const EntryTitle = styled.h2`
  font-size: var(--font-size-700);
  line-height: var(--line-height-700);
  font-weight: 700;
`;
const EntryDescription = styled.div`
  padding-top: 1.5rem;
  font-size: var(--font-size-600);
  line-height: var(--line-height-600);

  ${mq(Breakpoint.wide)} {
    padding-top: 2.25rem;
  }
`;
const EntryHead = styled.div`
  grid-column: 1 / -1;
  padding: 2.75rem 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 4.75rem 0;
    grid-column: 2 / span 6;
  }
`;
const EntryContent = styled.div`
  grid-column: 1 / -1;
  padding: 0 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 0;
    grid-column: 2 / -2;
  }
`;
const EntryContainer = styled.div`
  ${contentGrid(4)}
  ${mq(Breakpoint.mid)} {
    ${contentGrid(8)}
  }
`;

export const OrganizerPreviewPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const { entry } = useEntry<Organizer, OrganizerShow>(category, query);
  const language = useLanguage();
  const currentTranslation = getTranslation(language, entry?.data?.relations?.translations);
  const title = currentTranslation?.attributes?.name;

  return (
    <EntryContainer>
      <EntryHead>
        <EntryTitle>{title}</EntryTitle>
        <EntryDescription>{currentTranslation?.attributes?.description}</EntryDescription>
      </EntryHead>
      <EntryContent>
        <div>Debug Data:</div>
        <pre>{JSON.stringify(entry, null, 2)}</pre>
      </EntryContent>
    </EntryContainer>
  );
};
