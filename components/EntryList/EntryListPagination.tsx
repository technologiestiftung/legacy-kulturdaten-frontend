import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonVariant, IconPosition } from '../button';
import { mq } from '../globals/Constants';
import { Select, SelectVariant } from '../select';

const StyledEntryListPagination = styled.div<{ noHorizontalPadding?: boolean }>`
  display: flex;
  flex-direction: column;

  ${({ noHorizontalPadding }) => css`
    padding: ${noHorizontalPadding ? '0.75rem 0' : '0.75rem'};

    ${mq(Breakpoint.wide)} {
      padding: ${noHorizontalPadding ? '0.75rem 0' : '0.75rem 1.5rem'};
    }
  `}
`;

const StyledEntryListPaginationInteractive = styled.div`
  border-top: 1px solid var(--black);
  display: flex;
  flex-wrap: wrap;
  padding: 0.75rem 0 0;
  justify-content: space-between;
`;

const StyledEntryListPaginationSelect = styled.div`
  width: 100%;
  padding-bottom: 0.75rem;
`;

const StyledEntryListPaginationButton = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
`;

interface EntryListPaginationProps {
  currentPage: number;
  lastPage: number;
  entriesPerPage: number;
  totalEntries: number;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (index: number) => void;
  expanded: boolean;
  noHorizontalPadding?: boolean;
}

export const EntryListPagination: React.FC<EntryListPaginationProps> = ({
  currentPage,
  lastPage,
  entriesPerPage,
  totalEntries,
  nextPage,
  previousPage,
  goToPage,
  expanded,
  noHorizontalPadding,
}: EntryListPaginationProps) => {
  const t = useT();
  const pseudoUID = usePseudoUID();

  const renderedPageSelect = totalEntries && entriesPerPage && (
    <Select
      id={`entry-pagination-${pseudoUID}`}
      value={String(currentPage)}
      onChange={(e) => goToPage(parseInt(e.target.value, 10))}
      variant={SelectVariant.minimal}
    >
      {[...Array(Math.ceil(totalEntries / entriesPerPage))].map((i, key) => {
        const pageIndex = key + 1;
        return (
          <option key={pageIndex} value={String(pageIndex)}>
            {t('pagination.currentPage', { currentPage: pageIndex, lastPage })}
          </option>
        );
      })}
    </Select>
  );

  return (
    <StyledEntryListPagination noHorizontalPadding={noHorizontalPadding}>
      <StyledEntryListPaginationInteractive>
        {!expanded && (
          <StyledEntryListPaginationSelect>{renderedPageSelect}</StyledEntryListPaginationSelect>
        )}
        <StyledEntryListPaginationButton>
          <Button
            onClick={previousPage}
            variant={ButtonVariant.minimal}
            icon="ChevronLeft"
            iconPosition={IconPosition.left}
            disabled={currentPage === 1}
          >
            {t('pagination.previous')}
          </Button>
        </StyledEntryListPaginationButton>
        {expanded && renderedPageSelect}
        <StyledEntryListPaginationButton>
          <Button
            onClick={nextPage}
            disabled={currentPage === lastPage}
            variant={ButtonVariant.minimal}
            icon="ChevronRight"
          >
            {t('pagination.next')}
          </Button>
        </StyledEntryListPaginationButton>
      </StyledEntryListPaginationInteractive>
    </StyledEntryListPagination>
  );
};
