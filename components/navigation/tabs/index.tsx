import Link from 'next/link';
import styled from '@emotion/styled';
import { ArrowRightSvg } from '../../assets/ArrowRightSvg';
import { Breakpoint } from '../../../lib/WindowService';
import { insetBorder, mq } from '../../globals/Constants';
import { css } from '@emotion/react';

const StyledTabs = styled.nav<{ itemCount: number }>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  box-shadow: ${insetBorder(false, false, true)};
  background: var(--grey-200);
  border-radius: 0.75rem 0.75rem 0 0;
  overflow: hidden;
  border: 1px solid var(--grey-400);
  border-bottom: none;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: ${({ itemCount }) => `repeat(${itemCount < 4 ? itemCount : '4'}, 1fr)`};
    grid-column: 2 / -2;
  }
`;

const StyledTabLink = styled.a<{ isActive?: boolean; itemCount: number }>`
  display: flex;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  color: var(--black);
  text-decoration: none;
  padding: 0.75rem;
  background: var(--grey-200);
  box-shadow: ${insetBorder(false, true, true, false)};
  flex-direction: row;
  align-items: center;

  &:nth-of-type(2n) {
    box-shadow: ${insetBorder(false, false, true, false)};
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
    flex-shrink: 0;
  }

  ${mq(Breakpoint.mid)} {
    &:nth-of-type(2n) {
      box-shadow: ${insetBorder(false, true, true, false)};
    }
  }

  ${({ itemCount }) =>
    itemCount <= 3
      ? css`
          ${mq(Breakpoint.mid)} {
            &:nth-of-type(${`${itemCount}n`}) {
              box-shadow: ${insetBorder(false, false, true, false)};
            }
          }
        `
      : itemCount > 3
      ? css`
          ${mq(Breakpoint.mid)} {
            &:nth-of-type(4n) {
              box-shadow: ${insetBorder(false, false, true, false)};
            }
          }
        `
      : ''}
`;

export interface TabsProps {
  links: {
    title: string;
    href: string;
    isActive?: boolean;
  }[];
}

export const Tabs: React.FC<TabsProps> = ({ links }: TabsProps) => (
  <StyledTabs itemCount={links.length}>
    {links.map(({ title, href, isActive }, index) => (
      <Link key={index} href={href} passHref shallow>
        <StyledTabLink isActive={isActive} itemCount={links.length}>
          {isActive ? <ArrowRightSvg /> : ''}
          {title}
        </StyledTabLink>
      </Link>
    ))}
  </StyledTabs>
);
