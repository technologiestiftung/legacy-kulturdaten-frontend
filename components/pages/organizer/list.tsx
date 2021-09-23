import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Categories, useCategories } from '../../../config/categories';
import { routes } from '../../../config/routes';
import { OrganizerList as OrganizerListCall } from '../../../lib/api';
import { Organizer } from '../../../lib/api/types/organizer';
import { CategoryPage, useList } from '../../../lib/categories';
import { useLocale } from '../../../lib/routing';
import { Breakpoint, useBreakpointOrWider } from '../../../lib/WindowService';
import { EntryListContext } from '../../EntryList/EntryListContext';
import { OrganizerList } from '../../EntryList/OrganizerList';
import { AppWrapper } from '../../wrappers/AppWrapper';

export const OrganizerListPage: React.FC<CategoryPage> = () => {
  const categories = useCategories();
  const router = useRouter();
  const locale = useLocale();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const [listEvaluated, setListEvaluated] = useState(false);

  const { getCurrentPage, getEntriesPerPage, getSortKey, getOrder, getFilters, getLastEntryId } =
    useContext(EntryListContext);

  const listName = Categories.organizer;
  const filters = useMemo(() => getFilters(listName), [getFilters, listName]);
  const currentPage = useMemo(() => getCurrentPage(listName), [getCurrentPage, listName]);
  const entriesPerPage = useMemo(() => getEntriesPerPage(listName), [getEntriesPerPage, listName]);
  const sortKey = useMemo(() => getSortKey(listName), [getSortKey, listName]);
  const lastEntryId = useMemo(() => getLastEntryId(listName), [getLastEntryId, listName]);
  const order = useMemo(() => getOrder(listName), [getOrder, listName]);

  const list = useList<OrganizerListCall, Organizer>(
    categories.organizer,
    currentPage,
    entriesPerPage,
    Object.entries(filters),
    { key: sortKey, order }
  );

  useEffect(() => {
    if (list) {
      if (isMidOrWider && list?.data?.length > 0) {
        router.replace(
          routes.organizer({
            locale,
            query: { organizer: '1', id: lastEntryId || list.data[0].id, sub: 'info' },
          })
        );
      }
      setListEvaluated(true);
    }
  }, [list, list.data, locale, router, isMidOrWider, lastEntryId]);

  return listEvaluated ? (
    <AppWrapper>{!isMidOrWider ? <OrganizerList expanded={false} /> : ''}</AppWrapper>
  ) : null;
};
