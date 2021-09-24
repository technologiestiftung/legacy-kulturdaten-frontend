import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { PublishedStatus } from '../../lib/api/types/general';
import { useT } from '../../lib/i18n';
import { Breakpoint } from '../../lib/WindowService';
import { contentGrid, insetBorder, mq } from '../globals/Constants';
import { TabsProps } from '../navigation/tabs';

const StyledEntryHeader = styled.div`
  background: var(--grey-200);
  box-shadow: ${insetBorder(false, false, true)};
  grid-row-gap: 1.5rem;
  position: relative;
  z-index: 20;

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
    align-items: flex-start;
    margin-top: 3rem;
    padding: 0 1.5rem;
    flex-direction: row;
    justify-content: space-between;
    grid-column: 1 / -1;
    margin-bottom: 0.75rem;
  }

  ${mq(Breakpoint.widish)} {
    margin-top: 4.5rem;
    margin-bottom: 2.25rem;
    padding: 0;
    grid-column: 2 / -2;
  }
`;

const StyledEntryHeaderActions = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: flex-start;
  column-gap: 0.75rem;
  row-gap: 0.75rem;
  padding-top: 2.25rem;
  flex-wrap: wrap;
  flex-direction: row-reverse;

  ${mq(Breakpoint.mid)} {
    align-items: flex-start;
    display: flex;
    padding-top: 0;
    justify-content: flex-start;
  }

  ${mq(Breakpoint.wide)} {
    flex-wrap: nowrap;
  }
`;

const StyledEntryHeaderAction = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 0;
  flex-grow: 1;

  ${mq(Breakpoint.mid)} {
    flex-basis: initial;
    flex-grow: initial;
  }
`;

const StyledEntryHeaderTitle = styled.h1<{ skeleton: boolean }>`
  font-size: var(--font-size-700);
  line-height: var(--line-height-700);
  font-weight: 700;
  padding-right: 0.75rem;

  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
    font-size: var(--font-size-600);
    line-height: var(--line-height-600);
  }

  ${mq(Breakpoint.widish)} {
    padding-right: 1.5rem;
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

const StyledEntryHeaderPublishSlot = styled.div`
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

const StyledEntryHeaderTabsSlot = styled.div`
  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
  }

  ${contentGrid(8)}
`;

const tabsSlotWideLayout = css`
  grid-column: 2 / -2;
  padding: 0;
`;

const StyledEntryHeaderTabsSlotContainer = styled.div<{ wideLayout?: boolean }>`
  min-width: 0;
  grid-column: 1 / -1;
  padding: 0;

  ${mq(Breakpoint.widish)} {
    grid-column: 1 / -1;
    padding: 0 1.5rem;
  }

  ${({ wideLayout }) =>
    wideLayout
      ? css`
          ${mq(Breakpoint.widish)} {
            ${tabsSlotWideLayout}
          }
        `
      : css`
          @media screen and (min-width: calc(78.125rem + var(--organizer-band-width))) {
            ${tabsSlotWideLayout}
          }
        `}

  ${mq(Breakpoint.ultra)} {
    ${tabsSlotWideLayout}
  }
`;

const StyledEntryHeaderStatus = styled.div`
  display: flex;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  border-radius: 0.75rem;
  overflow: hidden;
  background: var(--white);
  flex-basis: 0;
  flex-grow: 1;

  ${mq(Breakpoint.mid)} {
    flex-basis: initial;
    flex-grow: initial;
    background: var(--grey-200);
  }
`;

const StyledEntryHeaderStatusLabel = styled.div`
  padding: calc(0.375rem) calc(0.75rem);
  flex-grow: 1;
  text-align: center;
`;

const StyledEntryHeaderStatusFlag = styled.div<{ backgroundColor: string }>`
  text-align: center;
  background: ${({ backgroundColor }) => backgroundColor};
  padding: calc(0.375rem) calc(0.75rem);
  flex-grow: 1;
`;

const statusBarStatuses: {
  [key in PublishedStatus]: { backgroundColor: string; textKey: string };
} = {
  draft: {
    backgroundColor: 'var(--yellow)',
    textKey: 'statusBar.draft',
  },
  published: {
    backgroundColor: 'var(--green-light)',
    textKey: 'statusBar.published',
  },
};

const useStatusBarFlag = (status = PublishedStatus.draft): React.ReactElement => {
  const t = useT();

  return (
    <StyledEntryHeaderStatusFlag backgroundColor={statusBarStatuses[status].backgroundColor}>
      {t(statusBarStatuses[status].textKey)}
    </StyledEntryHeaderStatusFlag>
  );
};

interface EntryHeaderProps {
  title: string;
  status: PublishedStatus;
  backButton?: React.ReactElement;
  actions?: React.ReactElement[];
  statusBar?: React.ReactElement;
  publish?: React.ReactElement;
  tabs?: React.ReactElement<TabsProps>;
  wideLayout?: boolean;
}

export const EntryHeader: React.FC<EntryHeaderProps> = ({
  title,
  actions,
  publish,
  tabs,
  status,
  wideLayout,
}: EntryHeaderProps) => {
  const t = useT();

  const statusFlag = useStatusBarFlag(status);

  return (
    <StyledEntryHeader>
      <StyledEntryHeaderHead>
        <StyledEntryHeaderTitle skeleton={typeof title === 'undefined'}>
          <span>{title}</span>
        </StyledEntryHeaderTitle>
        <StyledEntryHeaderActions>
          {actions?.map((action, index) => (
            <StyledEntryHeaderAction key={index}>{action}</StyledEntryHeaderAction>
          ))}
          <StyledEntryHeaderStatus>
            <StyledEntryHeaderStatusLabel>{t('statusBar.status')}</StyledEntryHeaderStatusLabel>

            {statusFlag}
          </StyledEntryHeaderStatus>
        </StyledEntryHeaderActions>
      </StyledEntryHeaderHead>
      {publish && <StyledEntryHeaderPublishSlot>{publish}</StyledEntryHeaderPublishSlot>}
      {tabs && (
        <StyledEntryHeaderTabsSlot>
          <StyledEntryHeaderTabsSlotContainer wideLayout={wideLayout}>
            {tabs}
          </StyledEntryHeaderTabsSlotContainer>
        </StyledEntryHeaderTabsSlot>
      )}
    </StyledEntryHeader>
  );
};
