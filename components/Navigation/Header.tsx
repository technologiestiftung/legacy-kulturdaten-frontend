import styled from '@emotion/styled';
import { useState } from 'react';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { MenuButton, MenuButtonState } from './MenuButton';

const HeaderContainer = styled.header`
  width: 100%;
  background: var(--grey-200);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid var(--grey-400);
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
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export const Header: React.FC<HeaderProps> = ({ title, Link, openState }: HeaderProps) => {
  const initialState = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = openState || initialState;

  const isWideOrWider = useBreakpointOrWider(Breakpoint.wide);

  return (
    <HeaderContainer>
      {!isWideOrWider ? (
        <MenuButton
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
          state={menuOpen ? MenuButtonState.close : MenuButtonState.open}
        />
      ) : (
        ''
      )}

      <Link content={<HeaderLink>{title}</HeaderLink>} />
    </HeaderContainer>
  );
};
