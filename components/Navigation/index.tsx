import styled from '@emotion/styled';
import Link from 'next/link';
import { ParsedUrlQuery } from 'node:querystring';

import { Route, useActiveRoute, useIsRouteStringActive, routes } from '../../config/routes';

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

const NavLink: React.FC<{ route: Route; query?: ParsedUrlQuery; children: React.ReactNode }> = ({
  route,
  query,
  children,
}: {
  route: Route;
  query?: ParsedUrlQuery;
  children: React.ReactNode;
}) => {
  const activeRoute = useIsRouteStringActive(route(query));

  return <StyledNavLink active={activeRoute}>{children}</StyledNavLink>;
};

export const Navigation: React.FC = () => {
  const activeRoute = useActiveRoute();

  return (
    <StyledNavigation>
      <div>Navigation</div>
      <div>Active Route: {activeRoute}</div>
      <StyledUl>
        <NavLink route={routes.dashboard}>
          <Link href={routes.dashboard()}>
            <a>Dashboard</a>
          </Link>
        </NavLink>
        <NavLink route={routes.userProfile}>
          <Link href={routes.userProfile()}>
            <a>User profile</a>
          </Link>
        </NavLink>
        <NavLink route={routes.providers}>
          <Link href={routes.providers()}>
            <a>Providers</a>
          </Link>
        </NavLink>
        <NavLink route={routes.provider} query={{ entry: 'example1' }}>
          <Link href={routes.provider({ entry: 'example1' })}>
            <a>Provider Example 1</a>
          </Link>
        </NavLink>
        <NavLink route={routes.provider} query={{ entry: 'example2' }}>
          <Link href={routes.provider({ entry: 'example2' })}>
            <a>Provider Example 2</a>
          </Link>
        </NavLink>
      </StyledUl>
    </StyledNavigation>
  );
};
