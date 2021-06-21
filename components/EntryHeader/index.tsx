import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { contentGrid, insetBorder, mq } from '../globals/Constants';
import { TabsProps } from '../navigation/tabs';

const StyledEntryHeader = styled.div`
  background: var(--grey-200);
  box-shadow: ${insetBorder(false, true, true, true)};
  grid-row-gap: 1.5rem;

  padding: 0 0.75rem;
  ${contentGrid(1)}

  ${mq(Breakpoint.mid)} {
    grid-row-gap: 2.25rem;
    box-shadow: ${insetBorder(false, true, true, false)};

    ${contentGrid(8)}
  }

  ${mq(Breakpoint.widish)} {
    padding: 0;
  }
`;

const StyledEntryHeaderHead = styled.div`
  display: flex;
  justify-content: space-between;

  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
  }

  ${mq(Breakpoint.widish)} {
    margin-top: 0.75rem;
    grid-column: 2 / -2;
  }
`;

const StyledEntryHeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const StyledEntryHeaderAction = styled.div`
  margin: 0.75rem 0 0 0.75rem;
`;

const StyledEntryHeaderBackButton = styled.div`
  margin: 0.75rem 0 0;
`;

const StyledEntryHeaderTitle = styled.h1<{ skeleton: boolean }>`
  font-size: var(--font-size-700);
  line-height: var(--line-height-700);
  font-weight: 700;

  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
  }

  ${mq(Breakpoint.widish)} {
    grid-column: 2 / -2;
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
          }
        `
      : ''}
`;

const StyledEntryHeaderStatusSlot = styled.div`
  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
  }

  ${mq(Breakpoint.widish)} {
    grid-column: 2 / -2;
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
  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
  }

  ${mq(Breakpoint.widish)} {
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
  backButton,
  actions,
  statusBar,
  publish,
  tabs,
}: EntryHeaderProps) => {
  return (
    <StyledEntryHeader>
      {(backButton || actions) && (
        <StyledEntryHeaderHead>
          <StyledEntryHeaderBackButton>{backButton}</StyledEntryHeaderBackButton>
          {actions && (
            <StyledEntryHeaderActions>
              {actions.map((action, index) => (
                <StyledEntryHeaderAction key={index}>{action}</StyledEntryHeaderAction>
              ))}
            </StyledEntryHeaderActions>
          )}
        </StyledEntryHeaderHead>
      )}
      <StyledEntryHeaderTitle skeleton={typeof title === 'undefined'}>
        {title}
      </StyledEntryHeaderTitle>
      {statusBar && <StyledEntryHeaderStatusSlot>{statusBar}</StyledEntryHeaderStatusSlot>}
      {publish && <StyledEntryHeaderPublishSlot>{publish}</StyledEntryHeaderPublishSlot>}
      {tabs && <StyledEntryHeaderTabsSlot>{tabs}</StyledEntryHeaderTabsSlot>}
    </StyledEntryHeader>
  );
};
