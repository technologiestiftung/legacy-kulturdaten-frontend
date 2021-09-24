import { useRouter } from 'next/router';
import { useCategories } from '../config/categories';
import { OrganizerShow } from './api/routes/organizer/show';
import { Organizer } from './api/types/organizer';
import { useEntry } from './categories';

export const useOrganizerId = (): string => {
  const router = useRouter();
  const organizerId = (router?.query?.organizer as string) || '1';

  return organizerId;
};

export const useOrganizer = (): Organizer => {
  const organizerId = useOrganizerId();
  const categories = useCategories();
  const { entry } = useEntry<Organizer, OrganizerShow>(categories?.organizer, {
    organizer: organizerId,
  });

  console.log(entry);

  return entry;
};
