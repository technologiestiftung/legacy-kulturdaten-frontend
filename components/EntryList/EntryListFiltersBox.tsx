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
      ? css`
          border-bottom: 1px solid var(--grey-400);
          padding-bottom: 1.125rem;
        `
      : css`
          border-top: 1px solid var(--grey-400);
          border-bottom: 1px solid var(--grey-400);
        `}
`;

const StyledFiltersBoxTitle = styled.div`
  border-bottom: 1px solid var(--grey-400);
  font-weight: 700;
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  padding: 1.125rem 0;
  margin: 0 0.75rem;
  width: calc(100% - 1.5rem);

  ${mq(Breakpoint.wide)} {
    margin: 0 1.5rem;
    width: calc(100% - 3rem);
  }
`;

const StyledFiltersBoxChildren = styled.div<{ expanded: boolean }>`
  display: flex;
  flex-direction: column;

  ${({ expanded }) =>
    expanded
      ? css``
      : css`
          border-top: 1px solid var(--grey-400);
        `}
`;

export const StyledFilters = styled.div<{ expanded: boolean }>`
  display: flex;
  background: var(--grey-200);
  flex-direction: column;

  ${({ expanded }) =>
    expanded
      ? css`
          padding: 0.75rem;
          flex-direction: row;
          align-items: flex-end;

          ${mq(Breakpoint.wide)} {
            padding: 0.75rem 1.5rem;
          }

          > div {
            margin-right: 0.75rem;
            flex-grow: 1;
            flex-basis: 0;
          }
        `
      : css`
          padding: 0.75rem;
          grid-template-columns: auto;

          > * {
            margin-bottom: 0.75rem;
          }

          ${mq(Breakpoint.wide)} {
            padding: 1.125rem 1.5rem;
            > * {
              margin-bottom: 1.125rem;
            }
          }
        `}

  > * {
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

  const renderedChildren = (
    <StyledFiltersBoxChildren expanded={expanded}>{children}</StyledFiltersBoxChildren>
  );

  const { renderedCollapsable } = useCollapsable(renderedChildren, isCollapsed, setIsCollapsed);

  return (
    <StyledFiltersBox expanded={expanded}>
      {expanded ? (
        <>
          <StyledFiltersBoxTitle>{t('general.filter')}</StyledFiltersBoxTitle>
          {renderedChildren}
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
