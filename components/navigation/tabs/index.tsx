import Link from 'next/link';
import styled from '@emotion/styled';
import { ArrowRightSvg } from '../../assets/ArrowRightSvg';
import { Breakpoint } from '../../../lib/WindowService';
import { mq } from '../../globals/Constants';
import { css } from '@emotion/react';

const StyledTabs = styled.nav`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  box-shadow: inset -1px -1px 0px var(--grey-400);
  background: var(--grey-200);

  ${mq(Breakpoint.mid)} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StyledTabLink = styled.a<{ isActive?: boolean }>`
  display: flex;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  color: var(--black);
  text-decoration: none;
  padding: 0.75rem;
  background: var(--grey-200);
  box-shadow: inset -1px -1px 0px var(--grey-400);
  flex-direction: row;
  align-items: center;

  &:nth-of-type(2n-1) {
    box-shadow: inset -1px -1px 0px var(--grey-400), inset 1px 0px 0px var(--grey-400);
  }

  ${({ isActive }) =>
    isActive
      ? css`
          text-decoration: underline;
          background: var(--white);
        `
      : ''}

  &:hover {
    text-decoration: underline;
    background: var(--white);
  }

  svg {
    display: inline-block;
    margin: 0 0.375rem 0 0;
    padding: 0;
  }

  ${mq(Breakpoint.mid)} {
    &:nth-of-type(2n-1) {
      box-shadow: inset -1px -1px 0px var(--grey-400);
    }
    &:nth-of-type(4n-3) {
      box-shadow: inset -1px -1px 0px var(--grey-400), inset 1px 0px 0px var(--grey-400);
    }
  }

  ${mq(Breakpoint.wide)} {
    &:nth-of-type(4n-3) {
      box-shadow: inset -1px -1px 0px var(--grey-400);
    }
  }
`;

interface TabsProps {
  links: {
    title: string;
    href: string;
    isActive?: boolean;
  }[];
}

export const Tabs: React.FC<TabsProps> = ({ links }: TabsProps) => (
  <StyledTabs>
    {links.map(({ title, href, isActive }, index) => (
      <Link key={index} href={href} passHref>
        <StyledTabLink isActive={isActive}>
          {isActive ? <ArrowRightSvg /> : ''}
          {title}
        </StyledTabLink>
      </Link>
    ))}
  </StyledTabs>
);
