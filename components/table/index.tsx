import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useMemo } from 'react';
import { ArrowDown, ArrowUp } from 'react-feather';
import { Order } from '../../lib/categories';
import { useT } from '../../lib/i18n';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { insetBorder, mq } from '../globals/Constants';

const StyledTable = styled.div`
  display: grid;
  grid-template-columns: auto;
  row-gap: 0;
`;

const StyledRow = styled.div<{ columnCount: number; isTitleRow?: boolean; narrow?: boolean }>`
  display: grid;
  grid-template-columns: 1;
  padding: 0.75rem 0;

  ${({ narrow, columnCount }) =>
    narrow !== true
      ? css`
          ${mq(Breakpoint.mid)} {
            padding: 0;
            grid-template-columns: repeat(
              ${columnCount},
              calc((100% - (0.75rem * (${columnCount} - 1))) / ${columnCount})
            );
            column-gap: 0.75rem;
            grid-template-rows: auto;
          }

          ${mq(Breakpoint.wide)} {
            grid-column: 1 / -1;
          }
        `
      : ''}
`;

const StyledRowWrapper = styled.div<{ narrow?: boolean; isTitleRow?: boolean }>`
  box-shadow: ${insetBorder(false, false, true)};

  ${({ narrow }) =>
    narrow
      ? css`
          &:last-of-type {
            box-shadow: ${insetBorder(false)};
          }
        `
      : ''}

  ${({ isTitleRow }) =>
    isTitleRow
      ? css`
          position: sticky;
          top: 0;
          left: 0;
          background: var(--grey-200);
          z-index: 1;
        `
      : ''}
`;

const StyledRowContainer = styled.div<{ narrow?: boolean }>`
  padding: 0 0.75rem;

  ${mq(Breakpoint.wide)} {
    padding: 0 1.5rem;
  }
`;

export const StyledCellSort = styled.button<{ active: boolean }>`
  padding: 0.1875rem 0.375rem;
  background: var(--white);
  border: none;
  appearance: none;
  display: flex;
  align-items: center;
  font-size: inherit;
  line-height: inherit;
  font-weight: inherit;
  border-radius: 0.375rem;
  margin-left: -0.375rem;
  cursor: pointer;
  transform: translateZ(0);
  transition: transform var(--transition-duration-fast), color var(--transition-duration-fast),
    background var(--transition-duration-fast), box-shadow var(--transition-duration-fast);
  box-shadow: none;

  svg {
    width: 1.125rem;
    height: 1.125rem;
    margin-left: 0.1875rem;
  }

  &:hover {
    transform: perspective(40px) translateZ(1px);
    box-shadow: 0 0 1.5rem -0.5rem rgba(0, 0, 0, 0.25);
    /* background: var(--grey-100); */
    color: var(--black);
  }

  ${({ active }) =>
    active &&
    css`
      background: var(--black);
      color: var(--white);

      &:hover {
        transform: perspective(40px) translateZ(1px);
        box-shadow: 0 0 1.5rem -0.5rem rgba(0, 0, 0, 0.25);
        /* background: var(--grey-700); */
        color: var(--white);
      }
    `}
`;

const StyledTablePlaceholder = styled.div`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  padding: 1.125rem 0.75rem;

  ${mq(Breakpoint.wide)} {
    padding: 1.5rem;
  }
`;

const StyledCell = styled.div<{
  isTitleRow?: boolean;
  bold?: boolean;
  narrow?: boolean;
  width?: number;
}>`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: ${({ isTitleRow, bold }) => (isTitleRow || bold ? '700' : '400')};
  padding: 0 0.375rem 0 0;
  word-wrap: break-word;
  grid-column: span ${({ width }) => width || 1};

  ${({ narrow }) =>
    narrow !== true
      ? css`
          ${mq(Breakpoint.mid)} {
            padding: 0.75rem 0.375rem 0.75rem 0;
          }
        `
      : ''}
`;

const StyledCellText = styled.span`
  padding: 0.1875rem 0;
  display: block;
`;

type TableContext = {
  narrow: boolean;
};

export const TableContext = React.createContext<TableContext>({
  narrow: false,
});

type TableContextProviderProps = {
  children: React.ReactNode;
  narrow: boolean;
};

export const TableContextProvider: React.FC<TableContextProviderProps> = ({
  children,
  narrow,
}: TableContextProviderProps) => {
  return (
    <TableContext.Provider
      value={{
        narrow,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export interface TableProps {
  columns: {
    title: string;
    bold?: boolean;
    width?: number;
    sort?: {
      order: Order;
      onClick: () => void;
      active: boolean;
    };
  }[];
  content: {
    contents: (string | React.ReactElement)[];
    Wrapper?: React.FC<{ children: React.ReactNode }>;
  }[];
  narrow?: boolean;
  placeholder?: string | React.ReactNode;
}

export const Table: React.FC<TableProps> = ({
  columns,
  content,
  narrow = false,
  placeholder,
}: TableProps) => {
  const columnCount = useMemo(
    () => columns?.reduce((count, { width = 1 }) => count + width, 0),
    [columns]
  );
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const t = useT();

  return (
    <StyledTable role="table">
      <TableContextProvider narrow={narrow}>
        {!narrow && isMidOrWider && (
          <StyledRowWrapper narrow={narrow} isTitleRow>
            <StyledRowContainer narrow={narrow}>
              <StyledRow columnCount={columnCount} isTitleRow role="row" narrow={narrow}>
                {columns?.map((cell, index) => {
                  return (
                    <StyledCell
                      width={columns[index].width}
                      key={index}
                      isTitleRow
                      role="columnheader"
                      narrow={narrow}
                    >
                      {cell.sort ? (
                        <StyledCellSort
                          active={cell.sort.active}
                          key={index}
                          onClick={cell.sort.onClick}
                          aria-label={
                            t('general.sorting', {
                              order: cell.sort.active
                                ? cell.sort.order === Order.ASC
                                  ? Order.DESC
                                  : Order.ASC
                                : cell.sort.order,
                              attribute: cell.title,
                            }) as string
                          }
                        >
                          <span>{cell.title}</span>
                          {cell.sort.order === Order.ASC ? <ArrowUp /> : <ArrowDown />}
                        </StyledCellSort>
                      ) : (
                        <StyledCellText>{cell.title}</StyledCellText>
                      )}
                    </StyledCell>
                  );
                })}
              </StyledRow>
            </StyledRowContainer>
          </StyledRowWrapper>
        )}
        {content?.length > 0
          ? content.map(({ contents, Wrapper }, rowIndex) => {
              const renderedRow = (
                <StyledRowContainer narrow={narrow}>
                  <StyledRow columnCount={columnCount} role="row" narrow={narrow}>
                    {contents?.map((cell, cellIndex) => (
                      <StyledCell
                        width={columns[cellIndex].width}
                        bold={columns[cellIndex].bold}
                        key={cellIndex}
                        role="cell"
                        narrow={narrow}
                      >
                        {cell}
                      </StyledCell>
                    ))}
                  </StyledRow>
                </StyledRowContainer>
              );

              return (
                <StyledRowWrapper key={rowIndex} narrow={narrow}>
                  {Wrapper ? <Wrapper>{renderedRow}</Wrapper> : renderedRow}
                </StyledRowWrapper>
              );
            })
          : placeholder && <StyledTablePlaceholder>{placeholder}</StyledTablePlaceholder>}
      </TableContextProvider>
    </StyledTable>
  );
};
