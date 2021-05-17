import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { contentGrid, mq } from '../globals/Constants';

interface TableProps {
  columns: {
    title: string;
    bold?: boolean;
  }[];
  content: (string | React.ReactElement)[][];
}

const StyledTable = styled.div`
  display: grid;
  grid-template-columns: auto;
  row-gap: 0;
`;

const StyledRow = styled.div<{ columnCount: number; isTitleRow?: boolean }>`
  display: grid;
  grid-template-columns: 1;
  padding: 0.75rem 0;

  ${mq(Breakpoint.mid)} {
    padding: 0;
    grid-template-columns: ${({ columnCount }) =>
      `repeat(${columnCount}, calc(
        (
          100% - 
          (1.5rem * (${columnCount} - 1))
          )
          /${columnCount}
          )
        )`};
    column-gap: 1.5rem;
    grid-template-rows: auto;
  }

  ${mq(Breakpoint.wide)} {
    grid-column: 2 / -2;
  }
`;

const StyledRowWrapper = styled.div`
  box-shadow: inset 0px -1px 0px var(--grey-400);
  padding: 0 0.75rem;

  ${mq(Breakpoint.wide)} {
    padding: 0;
    ${contentGrid(10)}
  }
`;

const StyledCell = styled.div<{ isTitleRow?: boolean; bold?: boolean }>`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: ${({ isTitleRow, bold }) => (isTitleRow || bold ? '700' : '400')};
  padding: 0;
  word-wrap: break-word;

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem 0;
  }

  ${({ isTitleRow }) =>
    isTitleRow
      ? css`
          text-transform: uppercase;
          font-size: var(--font-size-200);
          line-height: var(--line-height-200);
        `
      : ''}
`;

export const Table: React.FC<TableProps> = ({ columns, content }: TableProps) => {
  const columnCount = columns.length;
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);

  return (
    <StyledTable role="table">
      {isMidOrWider && (
        <StyledRowWrapper>
          <StyledRow columnCount={columnCount} isTitleRow role="row">
            {columns.map((cell, index) => (
              <StyledCell key={index} isTitleRow role="columnheader">
                {cell.title}
              </StyledCell>
            ))}
          </StyledRow>
        </StyledRowWrapper>
      )}
      {content.map((row, rowIndex) => (
        <StyledRowWrapper key={rowIndex}>
          <StyledRow columnCount={columnCount} role="row">
            {row.map((cell, cellIndex) => (
              <StyledCell bold={columns[cellIndex].bold} key={cellIndex} role="cell">
                {!isMidOrWider ? `${columns[cellIndex].title}: ` : ''}
                {cell}
              </StyledCell>
            ))}
          </StyledRow>
        </StyledRowWrapper>
      ))}
    </StyledTable>
  );
};
