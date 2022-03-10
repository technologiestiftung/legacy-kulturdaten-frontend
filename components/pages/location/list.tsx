import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Categories, useCategories } from '../../../config/categories';
import { routes } from '../../../config/routes';
import { LocationList as LocationListCall } from '../../../lib/api';
import { Location } from '../../../lib/api/types/location';
import { CategoryPage, useList } from '../../../lib/categories';
import { useActiveRoute, useLocale } from '../../../lib/routing';
import { useOrganizerId } from '../../../lib/useOrganizer';
import { Breakpoint, useBreakpointOrWider } from '../../../lib/WindowService';
import { EntryListContext } from '../../EntryList/EntryListContext';
import { LocationList } from '../../EntryList/LocationList';
import { AppWrapper } from '../../wrappers/AppWrapper';

export const LocationListPage: React.FC<CategoryPage> = () => {
  const categories = useCategories();
  const router = useRouter();
  const locale = useLocale();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const [listEvaluated, setListEvaluated] = useState(false);

  const { getCurrentPage, getEntriesPerPage, getSortKey, getOrder, getFilters, getLastEntryId } =
    useContext(EntryListContext);

  const listName = Categories.location;
  const filters = useMemo(() => getFilters(listName), [getFilters, listName]);
  const currentPage = useMemo(() => getCurrentPage(listName), [getCurrentPage, listName]);
  const entriesPerPage = useMemo(() => getEntriesPerPage(listName), [getEntriesPerPage, listName]);
  const sortKey = useMemo(() => getSortKey(listName), [getSortKey, listName]);
  const lastEntryId = useMemo(() => getLastEntryId(listName), [getLastEntryId, listName]);
  const order = useMemo(() => getOrder(listName), [getOrder, listName]);
  const organizerId = useOrganizerId();
  const activeRoute = useActiveRoute();

  const list = useList<LocationListCall, Location>(
    categories.location,
    currentPage,
    entriesPerPage,
    [...Object.entries(filters), ['organizer', organizerId]],
    { key: sortKey, order }
  );

  useEffect(() => {
    if (list) {
      if (isMidOrWider && list?.data?.length > 0) {
        router.replace(
          routes.location({
            locale,
            query: { organizer: organizerId, id: lastEntryId || list.data[0].id, sub: 'info' },
          })
        );
      }
      setListEvaluated(true);
    }
  }, [list, list.data, locale, router, isMidOrWider, lastEntryId, organizerId, activeRoute]);

  return listEvaluated ? (
    <AppWrapper>{!isMidOrWider ? <LocationList expanded={false} /> : ''}</AppWrapper>
  ) : null;
};
