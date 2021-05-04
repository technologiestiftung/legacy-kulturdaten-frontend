import styled from '@emotion/styled';
import { useContext } from 'react';
import { Breakpoint, useBreakpointOrWider, WindowContext } from '../../../lib/WindowService';
import { NavigationContext } from '../NavigationContext';
import { MenuButton, MenuButtonState } from './MenuButton';

const HeaderContainer = styled.header`
  width: 100%;
  background: var(--grey-200);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid var(--grey-400);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
`;

const HeaderLink = styled.a`
  text-decoration: none;
  color: inherit;
`;

interface HeaderProps {
  title: string;
  Link: React.FC<{ content: React.ReactElement }>;
}

export const Header: React.FC<HeaderProps> = ({ title, Link }: HeaderProps) => {
  const { mainMenuOpen, setMainMenuOpen } = useContext(NavigationContext);
  const { rendered } = useContext(WindowContext);
  const isWideOrWider = useBreakpointOrWider(Breakpoint.wide);

  return (
    <HeaderContainer>
      {rendered && !isWideOrWider ? (
        <MenuButton
          onClick={() => {
            setMainMenuOpen(!mainMenuOpen);
          }}
          state={mainMenuOpen ? MenuButtonState.close : MenuButtonState.open}
        />
      ) : (
        ''
      )}

      <Link content={<HeaderLink>{title}</HeaderLink>} />
    </HeaderContainer>
  );
};
