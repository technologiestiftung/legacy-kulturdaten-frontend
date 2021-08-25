import Link from 'next/link';
import styled from '@emotion/styled';
import { Breakpoint } from '../../../lib/WindowService';
import { mq } from '../../globals/Constants';
import { css } from '@emotion/react';

const StyledTabs = styled.nav`
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
`;

const StyledTabsContainer = styled.div<{ itemCount: number }>`
  position: relative;
  border-bottom: none;
  display: flex;
  flex-direction: row;
  padding: 0 1.125rem 0 0.75rem;

  ${mq(Breakpoint.mid)} {
    display: grid;
    padding: 0 1.5rem 0;
    grid-template-columns: ${({ itemCount }) => `repeat(${itemCount < 4 ? itemCount : '4'}, 1fr)`};
    grid-column: 2 / -2;
    column-gap: 0.75rem;
  }

  ${mq(Breakpoint.widish)} {
    padding: 0;
  }
`;

const StyledTabLink = styled.a<{ isActive?: boolean; itemCount: number; index: number }>`
  display: flex;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  color: var(--black);
  text-decoration: none;
  padding: calc(0.75rem - 1px) calc(1.5rem - 1px);
  background: var(--white);
  flex-direction: row;
  align-items: center;
  border: 1px solid var(--grey-400);
  border-radius: 0.75rem 0.75rem 0 0;
  margin-right: -0.375rem;

  ${mq(Breakpoint.mid)} {
    margin: 0;
  }

  @media screen and (pointer: fine) {
    &:hover {
      background: var(--grey-350);
    }
  }

  z-index: ${({ itemCount, index }) => itemCount - index};

  ${({ isActive, itemCount }) =>
    isActive
      ? css`
          background: var(--black);
          border-color: var(--black);
          color: var(--white);
          z-index: ${itemCount};

          &:hover {
            background: var(--black);
            border-color: var(--black);
            color: var(--white);
          }
        `
      : ''}

  svg {
    display: inline-block;
    margin: 0 0.75rem 0 0;
    padding: 0;
    flex-shrink: 0;
  }
`;

export interface TabsProps {
  links: {
    title: string;
    href: string;
    isActive?: boolean;
  }[];
}

export const Tabs: React.FC<TabsProps> = ({ links }: TabsProps) => (
  <StyledTabs role="tablist">
    <StyledTabsContainer itemCount={links.length}>
      {links.map(({ title, href, isActive }, index) => (
        <Link key={index} href={href} passHref shallow>
          <StyledTabLink isActive={isActive} itemCount={links.length} index={index} role="tab">
            {title}
          </StyledTabLink>
        </Link>
      ))}
    </StyledTabsContainer>
  </StyledTabs>
);
