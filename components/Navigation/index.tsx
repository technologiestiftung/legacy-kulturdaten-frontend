import styled from '@emotion/styled';
import Link from 'next/link';
import { ParsedUrlQuery } from 'node:querystring';
import { Locale } from '../../config/routes';

import {
  Route,
  useActiveRoute,
  useIsRouteStringActive,
  routes,
  useLocale,
} from '../../lib/routing';

const StyledNavigation = styled.nav`
  border: 2px solid black;
  margin-bottom: 2rem;
  padding: 1rem;
`;

const StyledUl = styled.ul`
  list-style: disc inside;
  padding: 1rem;
`;

const StyledNavLink = styled.li<{ active: boolean }>`
  font-weight: ${(props) => (props.active ? '600' : '400')};
  padding-bottom: 0.5rem;
`;

interface NavLinkProps {
  route: Route;
  locale: Locale;
  query?: ParsedUrlQuery;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ route, locale, query, children }: NavLinkProps) => {
  const activeRoute = useIsRouteStringActive(route({ query, locale }));

  return <StyledNavLink active={activeRoute}>{children}</StyledNavLink>;
};

export const Navigation: React.FC = () => {
  const activeRoute = useActiveRoute();
  const locale = useLocale();

  return (
    <StyledNavigation>
      <div>Navigation</div>
      <div>Active Route: {activeRoute}</div>
      <StyledUl>
        <NavLink route={routes.dashboard} locale={locale}>
          <Link href={routes.dashboard({ locale })}>
            <a>Dashboard</a>
          </Link>
        </NavLink>
        <NavLink route={routes.userProfile} locale={locale}>
          <Link href={routes.userProfile({ locale })}>
            <a>User profile</a>
          </Link>
        </NavLink>
        <NavLink route={routes.providers} locale={locale}>
          <Link href={routes.providers({ locale })}>
            <a>Providers</a>
          </Link>
        </NavLink>
        <NavLink route={routes.provider} query={{ entry: 'example1' }} locale={locale}>
          <Link href={routes.provider({ query: { entry: 'example1' }, locale })}>
            <a>Provider Example 1</a>
          </Link>
        </NavLink>
        <NavLink route={routes.provider} query={{ entry: 'example2' }} locale={locale}>
          <Link href={routes.provider({ query: { entry: 'example2' }, locale })}>
            <a>Provider Example 2</a>
          </Link>
        </NavLink>
      </StyledUl>
    </StyledNavigation>
  );
};
