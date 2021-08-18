import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { contentGrid, insetBorder, mq } from '../globals/Constants';
import { TabsProps } from '../navigation/tabs';

const StyledEntryHeader = styled.div`
  background: var(--grey-200);
  box-shadow: ${insetBorder(false, false, true)};
  grid-row-gap: 1.5rem;

  ${contentGrid(1)}

  ${mq(Breakpoint.mid)} {
    grid-row-gap: 2.25rem;
    background: var(--white);

    ${contentGrid(8)}
  }

  ${mq(Breakpoint.widish)} {
    padding: 0;
  }
`;

const StyledEntryHeaderHead = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2.25rem;

  padding: 0 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 0 1.5rem;
    flex-direction: row;
    justify-content: space-between;
    grid-column: 1 / -1;
  }

  ${mq(Breakpoint.widish)} {
    margin-top: 3rem;
    padding: 0;
    grid-column: 2 / -2;
  }
`;

const StyledEntryHeaderActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-top: 2.25rem;

  ${mq(Breakpoint.mid)} {
    padding-top: 0;
    flex-direction: row;
    justify-content: flex-end;
  }
`;

const StyledEntryHeaderAction = styled.div`
  margin: 0 0 0.75rem;
  display: flex;
  flex-direction: column;

  ${mq(Breakpoint.mid)} {
    margin: 0 0 0.75rem 0.75rem;
  }
`;

const StyledEntryHeaderTitle = styled.h1<{ skeleton: boolean }>`
  font-size: var(--font-size-700);
  line-height: var(--line-height-700);
  font-weight: 700;

  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
    font-size: var(--font-size-600);
    line-height: var(--line-height-600);
  }

  ${mq(Breakpoint.widish)} {
    grid-column: 2 / -2;
  }

  span {
    border-bottom: 0.125rem solid currentColor;
  }

  ${({ skeleton }) =>
    skeleton
      ? css`
          &:after {
            content: '';
            display: block;
            position: relative;
            height: var(--line-height-700);
            width: 20rem;
            background: var(--grey-350);

            ${mq(Breakpoint.mid)} {
              height: var(--line-height-600);
            }
          }
        `
      : ''}
`;

const StyledEntryHeaderStatusSlot = styled.div`
  padding: 0 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 0 1.5rem;

    grid-column: 1 / -1;
  }

  ${mq(Breakpoint.widish)} {
    grid-column: 2 / -2;
    padding: 0;
  }
`;

const StyledEntryHeaderPublishSlot = styled.div`
  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
  }

  ${mq(Breakpoint.widish)} {
    grid-column: 2 / -2;
  }
`;

const StyledEntryHeaderTabsSlot = styled.div`
  width: 100%;
  max-width: 100%;
  margin-top: 0.75rem;

  overflow: hidden;

  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
  }

  ${mq(Breakpoint.widish)} {
    margin-top: 1.5rem;
    grid-column: 2 / -2;
  }
`;

interface EntryHeaderProps {
  title: string;
  backButton?: React.ReactElement;
  actions?: React.ReactElement[];
  statusBar?: React.ReactElement;
  publish?: React.ReactElement;
  tabs?: React.ReactElement<TabsProps>;
}

export const EntryHeader: React.FC<EntryHeaderProps> = ({
  title,
  actions,
  statusBar,
  publish,
  tabs,
}: EntryHeaderProps) => {
  return (
    <StyledEntryHeader>
      <StyledEntryHeaderHead>
        <StyledEntryHeaderTitle skeleton={typeof title === 'undefined'}>
          <span>{title}</span>
        </StyledEntryHeaderTitle>
        {actions && (
          <StyledEntryHeaderActions>
            {actions.map((action, index) => (
              <StyledEntryHeaderAction key={index}>{action}</StyledEntryHeaderAction>
            ))}
          </StyledEntryHeaderActions>
        )}
      </StyledEntryHeaderHead>
      {statusBar && <StyledEntryHeaderStatusSlot>{statusBar}</StyledEntryHeaderStatusSlot>}
      {publish && <StyledEntryHeaderPublishSlot>{publish}</StyledEntryHeaderPublishSlot>}
      {tabs && <StyledEntryHeaderTabsSlot>{tabs}</StyledEntryHeaderTabsSlot>}
    </StyledEntryHeader>
  );
};
