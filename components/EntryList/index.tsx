import styled from '@emotion/styled';
import { Language } from '../../config/locale';
import { CategoryEntry } from '../../lib/api/types/general';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

export const StyledEntryListBody = styled.div`
  background: var(--grey-200);
  padding: 1.5rem 0.75rem;

  ${mq(Breakpoint.wide)} {
    padding: 2.25rem 1.5rem;
  }
`;

export interface EntryListProps<EntryType extends CategoryEntry> {
  title: string;
  useList: (query: {
    page: string;
    size: string;
  }) => {
    data: EntryType[];
    meta: {
      language: Language;
      pages: {
        total: number;
        perPage: number;
        currentPage: number;
        lastPage: number;
      };
    };
  };
  expanded: boolean;
}

export const EntryList = <EntryType extends CategoryEntry>({
  title,
  useList,
}: EntryListProps<EntryType>): React.ReactElement<EntryListProps<EntryType>> => undefined;
