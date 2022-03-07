import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Categories, useCategories } from '../../../config/categories';
import { routes } from '../../../config/routes';
import { OfferList as OfferListCall } from '../../../lib/api';
import { Offer } from '../../../lib/api/types/offer';
import { CategoryPage, useList } from '../../../lib/categories';
import { useLocale } from '../../../lib/routing';
import { useOrganizerId } from '../../../lib/useOrganizer';
import { Breakpoint, useBreakpointOrWider } from '../../../lib/WindowService';
import { EntryListContext } from '../../EntryList/EntryListContext';
import { OfferList } from '../../EntryList/OfferList';
import { defaultOrganizerId } from '../../navigation/NavigationContext';
import { AppWrapper } from '../../wrappers/AppWrapper';

export const OfferListPage: React.FC<CategoryPage> = () => {
  const categories = useCategories();
  const router = useRouter();
  const locale = useLocale();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const [listEvaluated, setListEvaluated] = useState(false);

  const { getCurrentPage, getEntriesPerPage, getSortKey, getOrder, getFilters, getLastEntryId } =
    useContext(EntryListContext);

  const listName = Categories.offer;
  const filters = useMemo(() => getFilters(listName), [getFilters, listName]);
  const currentPage = useMemo(() => getCurrentPage(listName), [getCurrentPage, listName]);
  const entriesPerPage = useMemo(() => getEntriesPerPage(listName), [getEntriesPerPage, listName]);
  const sortKey = useMemo(() => getSortKey(listName), [getSortKey, listName]);
  const lastEntryId = useMemo(() => getLastEntryId(listName), [getLastEntryId, listName]);
  const order = useMemo(() => getOrder(listName), [getOrder, listName]);
  const organizerId = useOrganizerId();

  const list = useList<OfferListCall, Offer>(
    categories.offer,
    currentPage,
    entriesPerPage,
    [...Object.entries(filters), ['organizers', organizerId]],
    { key: sortKey, order },
    organizerId !== defaultOrganizerId
  );

  useEffect(() => {
    if (list) {
      if (isMidOrWider && list?.data?.length > 0) {
        console.log('trigger redirect from offer list');
        router.replace(
          routes.offer({
            locale,
            query: {
              organizer: organizerId,
              id:
                lastEntryId && list.data.find((entry) => entry.id === lastEntryId)
                  ? lastEntryId
                  : list.data[0].id,
              sub: 'info',
            },
          })
        );
      }
      setListEvaluated(true);
    }
  }, [list, list.data, locale, router, isMidOrWider, lastEntryId, organizerId]);

  return listEvaluated ? (
    <AppWrapper>{!isMidOrWider ? <OfferList expanded={false} /> : ''}</AppWrapper>
  ) : null;
};
