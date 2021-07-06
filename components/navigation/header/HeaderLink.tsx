import React, { useContext } from 'react';
import Link from 'next/link';

import { useLocale, routes } from '../../../lib/routing';
import { NavigationContext } from '../NavigationContext';

export interface HeaderLinkProps {
  children: React.ReactElement<HTMLAnchorElement>;
}

export const HeaderLink: React.FC<HeaderLinkProps> = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const locale = useLocale();
  const { setNavigationOpen } = useContext(NavigationContext);

  return (
    <Link href={routes.dashboard({ locale })} passHref>
      {React.cloneElement(children, { onClick: () => setNavigationOpen(false) })}
    </Link>
  );
};
