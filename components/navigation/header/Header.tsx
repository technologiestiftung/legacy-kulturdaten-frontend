import styled from '@emotion/styled';
import { useContext } from 'react';
import { Breakpoint, useBreakpointOrWider, WindowContext } from '../../../lib/WindowService';
import { mq } from '../../globals/Constants';
import { NavigationContext } from '../NavigationContext';
import { MenuButton, MenuButtonState } from './MenuButton';

const HeaderContainer = styled.header`
  width: 100%;
  background: var(--grey-200);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-bottom: 1px solid var(--grey-400);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem;
    box-shadow: none;
  }
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: inherit;
  padding: 0.375rem 0;
`;

interface HeaderProps {
  title: string;
  Link: React.FC<{ children: React.ReactElement<HTMLAnchorElement> }>;
  button?: React.ReactElement;
}

export const Header: React.FC<HeaderProps> = ({ title, Link, button }: HeaderProps) => {
  const { mainMenuOpen, setMainMenuOpen } = useContext(NavigationContext);
  const { rendered } = useContext(WindowContext);
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);

  const renderedLink = (
    <Link>
      <StyledLink>{title}</StyledLink>
    </Link>
  );

  return (
    <HeaderContainer>
      {rendered && !isMidOrWider ? (
        <MenuButton
          onClick={() => {
            setMainMenuOpen(!mainMenuOpen);
          }}
          state={mainMenuOpen ? MenuButtonState.close : MenuButtonState.open}
        />
      ) : (
        ''
      )}

      {button ? (
        isMidOrWider ? (
          button
        ) : (
          <>
            {button}
            {renderedLink}
          </>
        )
      ) : (
        renderedLink
      )}
    </HeaderContainer>
  );
};
