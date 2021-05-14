import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { contentGrid, mq } from '../../globals/Constants';
import { Tabs } from '../../navigation/tabs';
import { TitleBar } from '../../navigation/TitleBar';
import { AppWrapper } from '../../wrappers/AppWrapper';
import { CategoryEntryPage } from '../../../lib/categories';
import { useLocale } from '../../../lib/routing';
import { Breakpoint } from '../../../lib/WindowService';

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
  padding: 3.75rem 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 6.75rem 0;
    grid-column: 2 / span 4;
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
    ${contentGrid(11)}
  }

  ${mq(Breakpoint.wide)} {
    ${contentGrid(10)}
  }
`;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface OrganigerShowPageProps extends CategoryEntryPage {}

export const OrganizerShowPage: React.FC<OrganigerShowPageProps> = ({
  category,
  entry,
}: OrganigerShowPageProps) => {
  const router = useRouter();
  const locale = useLocale();

  const title = entry?.attributes?.name;

  const tabLinks = [
    { title: 'Übersicht', path: '' },
    { title: 'Informationen', path: 'info/' },
    { title: 'Zugriffsrechte', path: 'rights/' },
    { title: 'Export', path: 'export/' },
  ].map(({ title, path }) => {
    const href = `${category?.routes.list({ locale, query: router.query })}${path}`;

    return {
      title,
      href,
      isActive: router.asPath === href,
    };
  });

  return (
    <AppWrapper titleBar={<TitleBar title={title} />}>
      <Tabs links={tabLinks} />
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
          <pre>{JSON.stringify(entry, null, 2)}</pre>
        </EntryContent>
      </EntryContainer>
    </AppWrapper>
  );
};
