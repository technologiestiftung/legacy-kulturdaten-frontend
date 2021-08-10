import Link from 'next/link';

import { useLocale, routes } from '../../../lib/routing';

export interface HeaderLinkProps {
  children: React.ReactElement<HTMLAnchorElement>;
}

export const HeaderLink: React.FC<HeaderLinkProps> = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const locale = useLocale();

  return (
    <Link href={routes.dashboard({ locale })} passHref>
      {children}
    </Link>
  );
};
