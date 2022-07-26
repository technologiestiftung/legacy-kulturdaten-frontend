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

const StyledTabsContainer = styled.ul<{ itemCount: number }>`
  position: relative;
  border-bottom: none;
  display: flex;
  flex-direction: row;
  padding: 0 1.125rem 0 0.75rem;

  ${mq(Breakpoint.mid)} {
    display: grid;
    padding: 0 1.5rem 0;
    grid-template-columns: ${({ itemCount }) => `repeat(${itemCount < 5 ? itemCount : '5'}, 1fr)`};
    grid-column: 2 / -2;
    column-gap: 0.75rem;
  }

  ${mq(Breakpoint.widish)} {
    padding: 0;
  }
`;

const StyledTab = styled.li`
  position: relative;
  margin-right: -0.375rem;

  &:last-of-type {
    margin: 0;
    padding-right: 0.75rem;

    ${mq(Breakpoint.mid)} {
      padding-right: 0;
    }
  }
`;

const StyledTabLink = styled.a<{
  isActive?: boolean;
  itemCount: number;
  index: number;
  disabled?: boolean;
}>`
  display: flex;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  color: var(--black);
  text-decoration: none;
  padding: calc(0.75rem - 1px) calc(1.5rem - 1px);
  background: var(--white);
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--grey-400);
  border-radius: 0.75rem 0.75rem 0 0;
  position: relative;

  ${mq(Breakpoint.mid)} {
    margin: 0;
  }

  @media screen and (pointer: fine) {
    &:hover {
      background: var(--grey-350);
    }
  }

  z-index: ${({ itemCount, index }) => itemCount - index};


  &:focus {
    border: 3px #275EC5 solid;
    padding-top: calc(0.75rem - 3px);
    margin: 0 -2px;
    margin-bottom: -4px;
    box-shadow: inset 0 0 0 2px var(--white);
  }

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

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.25;

      &:hover {
        background: var(--white);
        border-color: var(--grey-400);
        color: var(--black);
      }
    `}
`;

export interface TabsProps {
  links: {
    title: string;
    href: string;
    isActive?: boolean;
    disabled?: boolean;
  }[];
}

export const Tabs: React.FC<TabsProps> = ({ links }: TabsProps) => (
  <StyledTabs role="tablist">
    <StyledTabsContainer itemCount={links.length}>
      {links.map(({ title, href, isActive, disabled }, index) => {
        const renderedTab = (
          <StyledTabLink
            disabled={disabled}
            as={disabled ? 'div' : undefined}
            isActive={isActive}
            itemCount={links.length}
            index={index}
            role="tab"
          >
            {title}
          </StyledTabLink>
        );

        return (
          <StyledTab key={index}>
            {disabled ? (
              renderedTab
            ) : (
              <Link href={href} passHref shallow>
                {renderedTab}
              </Link>
            )}
          </StyledTab>
        );
      })}
    </StyledTabsContainer>
  </StyledTabs>
);
