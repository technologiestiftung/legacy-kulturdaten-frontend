import styled from '@emotion/styled';
import { Language } from '../../config/locale';
import { CategoryEntry } from '../../lib/api/types/general';

export const StyledEntryListBody = styled.div`
  background: var(--grey-200);
  padding: 0 0 1.5rem;
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
