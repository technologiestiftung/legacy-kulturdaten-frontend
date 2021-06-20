import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { insetBorder, contentGrid, mq } from '../globals/Constants';

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
              calc((100% - (1.5rem * (${columnCount} - 1))) / ${columnCount})
            );
            column-gap: 1.5rem;
            grid-template-rows: auto;
          }

          ${mq(Breakpoint.wide)} {
            grid-column: 2 / -2;
          }
        `
      : ''}
`;

const StyledRowWrapper = styled.div<{ narrow?: boolean; isHeader?: boolean }>`
  box-shadow: ${insetBorder(false, true, true)};

  ${({ narrow }) =>
    narrow
      ? css`
          &:last-of-type {
            box-shadow: ${insetBorder(false, true, false)};
          }
        `
      : ''}

  ${({ isHeader }) =>
    isHeader
      ? css`
          position: sticky;
          top: 0;
          left: 0;
          background: var(--white);
          box-shadow: ${insetBorder(false, true, true, true)};
          z-index: 1;

          ${mq(Breakpoint.wide)} {
            box-shadow: ${insetBorder(false, true, true)};
          }
        `
      : ''}
`;

const StyledRowContainer = styled.div<{ narrow?: boolean }>`
  padding: 0 0.75rem;

  ${({ narrow }) =>
    narrow !== true
      ? css`
          ${mq(Breakpoint.wide)} {
            padding: 0;
            ${contentGrid(10)}
          }
        `
      : null}
`;

const StyledCell = styled.div<{ isTitleRow?: boolean; bold?: boolean; narrow?: boolean }>`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: ${({ isTitleRow, bold }) => (isTitleRow || bold ? '700' : '400')};
  padding: 0;
  word-wrap: break-word;

  ${({ narrow }) =>
    narrow !== true
      ? css`
          ${mq(Breakpoint.mid)} {
            padding: 0.75rem 0;
          }
        `
      : ''}

  ${({ isTitleRow }) =>
    isTitleRow
      ? css`
          text-transform: uppercase;
          font-size: var(--font-size-200);
          line-height: var(--line-height-200);
        `
      : ''}
`;

export interface TableProps {
  columns: {
    title: string;
    bold?: boolean;
  }[];
  content: {
    contents: (string | React.ReactElement)[];
    Wrapper?: React.FC<{ children: React.ReactNode }>;
  }[];
  narrow?: boolean;
}

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

export const Table: React.FC<TableProps> = ({ columns, content, narrow = false }: TableProps) => {
  const columnCount = columns.length;
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);

  return (
    <StyledTable role="table">
      <TableContextProvider narrow={narrow}>
        {!narrow && isMidOrWider && (
          <StyledRowWrapper narrow={narrow} isHeader>
            <StyledRowContainer narrow={narrow}>
              <StyledRow columnCount={columnCount} isTitleRow role="row" narrow={narrow}>
                {columns.map((cell, index) => (
                  <StyledCell key={index} isTitleRow role="columnheader" narrow={narrow}>
                    {cell.title}
                  </StyledCell>
                ))}
              </StyledRow>
            </StyledRowContainer>
          </StyledRowWrapper>
        )}
        {content.map(({ contents, Wrapper }, rowIndex) => {
          const renderedRow = (
            <StyledRowContainer narrow={narrow}>
              <StyledRow columnCount={columnCount} role="row" narrow={narrow}>
                {contents.map((cell, cellIndex) => (
                  <StyledCell
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
        })}
      </TableContextProvider>
    </StyledTable>
  );
};
