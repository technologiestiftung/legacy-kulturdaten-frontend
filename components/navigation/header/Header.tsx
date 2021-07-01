import styled from '@emotion/styled';
import { useContext } from 'react';
import { Maximize2, Minimize2 } from 'react-feather';
import { Breakpoint, useBreakpointOrWider, WindowContext } from '../../../lib/WindowService';
import { Button, ButtonVariant, IconPosition } from '../../button';
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
  border-bottom: 1px solid var(--grey-400);

  ${mq(Breakpoint.mid)} {
    box-shadow: none;
  }
`;

const StyledLink = styled.a`
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  text-decoration: none;
  color: inherit;
  padding: 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 1.125rem 0.75rem;
  }
`;

const StyledHeaderButton = styled.div`
  padding: 0.375rem 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem;
  }
`;

const StyledExpandableButton = styled.button`
  appearance: none;
  border: none;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--black);
  border-left: 1px solid var(--grey-400);
  align-self: stretch;
  width: 3.75rem;
  cursor: pointer;
  color: var(--white);

  svg {
    transform: rotate(45deg);
  }

  &:hover {
    background: var(--grey-600);
  }
`;

interface HeaderProps {
  title: string;
  Link: React.FC<{ children: React.ReactElement<HTMLAnchorElement> }>;
  button?: React.ReactElement;
  expandable?: boolean;
  subMenuKey?: string;
  defaultMenuKey: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  Link,
  button,
  expandable,
  subMenuKey,
  defaultMenuKey,
}: HeaderProps) => {
  const {
    mainMenuOpen,
    setMainMenuOpen,
    menuExpanded,
    setMenuExpanded,
    setActiveMenuKey,
    activeMenuKey,
  } = useContext(NavigationContext);
  const { rendered } = useContext(WindowContext);
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);

  const isDefaultMenu = typeof activeMenuKey === 'undefined' || activeMenuKey === defaultMenuKey;

  const renderedLink = (
    <Link>
      <StyledLink>{title}</StyledLink>
    </Link>
  );

  const renderedButton = !isDefaultMenu ? (
    <StyledHeaderButton>
      <Button
        variant={ButtonVariant.minimal}
        onClick={() => {
          setActiveMenuKey(defaultMenuKey);
          setMainMenuOpen(true);
        }}
        icon="ChevronLeft"
        iconPosition={IconPosition.left}
      >
        main
      </Button>
    </StyledHeaderButton>
  ) : undefined;

  const renderedSubMenuButton = (
    <StyledHeaderButton>
      <Button
        variant={ButtonVariant.minimal}
        onClick={() => {
          setActiveMenuKey(subMenuKey);
          setMainMenuOpen(true);
        }}
        icon="ChevronLeft"
        iconPosition={IconPosition.left}
      >
        up
      </Button>
    </StyledHeaderButton>
  );

  return (
    <HeaderContainer>
      {/* {rendered && !isMidOrWider ? (
        <MenuButton
          onClick={() => {
            setMainMenuOpen(!mainMenuOpen);
          }}
          state={mainMenuOpen ? MenuButtonState.close : MenuButtonState.open}
        />
      ) : (
        ''
      )} */}

      {!isMidOrWider
        ? mainMenuOpen || typeof subMenuKey === 'undefined'
          ? renderedButton
          : renderedSubMenuButton
        : renderedButton}

      {(isMidOrWider || !expandable) && (!isMidOrWider || !renderedButton) && renderedLink}

      {isMidOrWider && expandable && (
        <StyledExpandableButton onClick={() => setMenuExpanded(!menuExpanded)}>
          {menuExpanded ? <Minimize2 /> : <Maximize2 />}
        </StyledExpandableButton>
      )}
    </HeaderContainer>
  );
};
