import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { PropsWithChildren } from 'react';
import { ChevronDown } from 'react-feather';
import { useT } from '../../lib/i18n';
import { Breakpoint } from '../../lib/WindowService';
import { useCollapsable } from '../collapsable';
import { mq } from '../globals/Constants';

const StyledFiltersBox = styled.div<{ expanded: boolean }>`
  ${({ expanded }) =>
    expanded
      ? css``
      : css`
          border-bottom: 1px solid var(--grey-400);
        `}
`;

const StyledFiltersBoxTitle = styled.div`
  width: 100%;
  border-bottom: 1px solid var(--grey-400);
  padding: 0 0 0.375rem;
  margin: 0 0 0.75rem;
`;

const StyledFilterBoxChild = styled.div``;

const StyledFiltersBoxChildren = styled.div<{ expanded: boolean }>`
  display: flex;
  background: var(--grey-200);

  ${({ expanded }) =>
    expanded
      ? css`
          ${StyledFilterBoxChild} {
            margin-right: 0.75rem;
            flex-grow: 1;
            flex-basis: 0;
          }
        `
      : css`
          flex-direction: column;
          padding: 0.75rem;
          border-top: 1px solid var(--grey-400);
          grid-template-columns: auto;

          ${StyledFilterBoxChild} {
            margin-bottom: 0.75rem;
          }

          ${mq(Breakpoint.wide)} {
            padding: 1.125rem 1.5rem;
            ${StyledFilterBoxChild} {
              margin-bottom: 1.125rem;
            }
          }
        `}

  ${StyledFilterBoxChild} {
    &:last-of-type {
      margin: 0;
    }
  }
`;

const StyledFiltersBoxTitleButton = styled.button<{ isCollapsed: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  appearance: none;
  width: calc(100% - 4px);
  background: var(--grey-200);
  border: none;
  padding: calc(0.75rem - 2px);
  margin: 0;
  text-align: left;
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
  cursor: pointer;
  color: var(--black);
  margin: 2px;
  border-radius: 0.75rem;

  ${mq(Breakpoint.wide)} {
    padding: calc(0.75rem - 2px) calc(1.5rem - 2px);
  }

  &:hover {
    background: var(--grey-350);
  }

  > svg {
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    transition: transform var(--transition-duration);
    transform: rotateX(${({ isCollapsed }) => (isCollapsed ? '0deg' : '180deg')});
  }
`;

interface FiltersBoxProps {
  expanded: boolean;
  activeFiltersCount?: number;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export const EntryListFiltersBox: React.FC<PropsWithChildren<FiltersBoxProps>> = ({
  expanded,
  children,
  activeFiltersCount,
  isCollapsed,
  setIsCollapsed,
}: PropsWithChildren<FiltersBoxProps>) => {
  const t = useT();

  const wrappedChildren = (
    <StyledFiltersBoxChildren expanded={expanded}>
      {React.Children.map(children, (child, index) => (
        <StyledFilterBoxChild key={index}>{child}</StyledFilterBoxChild>
      ))}
    </StyledFiltersBoxChildren>
  );

  const { renderedCollapsable } = useCollapsable(wrappedChildren, isCollapsed, setIsCollapsed);

  return (
    <StyledFiltersBox expanded={expanded}>
      {expanded ? (
        <>
          <StyledFiltersBoxTitle>{t('general.filter')}</StyledFiltersBoxTitle>
          {wrappedChildren}
        </>
      ) : (
        <>
          <StyledFiltersBoxTitleButton
            isCollapsed={isCollapsed}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {t('general.filter')}
            {activeFiltersCount
              ? ` (${t('categories.organizer.filters.activeFilters', { activeFiltersCount })})`
              : ''}
            <ChevronDown />
          </StyledFiltersBoxTitleButton>
          {renderedCollapsable}
        </>
      )}
    </StyledFiltersBox>
  );
};
