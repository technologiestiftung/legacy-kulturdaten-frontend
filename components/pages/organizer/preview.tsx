import styled from '@emotion/styled';
import { contentGrid, mq } from '../../globals/Constants';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { Breakpoint } from '../../../lib/WindowService';
import { Organizer } from '../../../lib/api/types/organizer';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { Formatter } from '.././../../components/formatter';

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
  const title = entry?.attributes?.name;

  return (
    <EntryContainer>
      <EntryHead>
        <EntryTitle>{title}</EntryTitle>
        <EntryDescription>
          Placeholder: Erat elit mauris rhoncus purus ac in risus. Felis, orci leo viverra enim,
          nunc, dolor amet, risus orci. Consectetur lacus libero.
        </EntryDescription>
      </EntryHead>
      <EntryContent>
        <div>Data:</div>
        <Formatter>{JSON.stringify(entry, null, 2)}</Formatter>
      </EntryContent>
    </EntryContainer>
  );
};
