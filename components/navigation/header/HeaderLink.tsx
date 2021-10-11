import Link from 'next/link';

import { useLocale, routes } from '../../../lib/routing';
import { useOrganizerId } from '../../../lib/useOrganizer';

export interface HeaderLinkProps {
  children: React.ReactElement<HTMLAnchorElement>;
}

export const HeaderLink: React.FC<HeaderLinkProps> = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const locale = useLocale();
  const organizerId = useOrganizerId();

  return (
    <Link href={routes.dashboard({ locale, query: { organizer: organizerId } })} passHref>
      {children}
    </Link>
  );
};
