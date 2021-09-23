import { useRouter } from 'next/router';

export const useOrganizer = (): string => {
  const router = useRouter();
  const organizerId = router?.query?.organizer as string;

  return organizerId;
};
