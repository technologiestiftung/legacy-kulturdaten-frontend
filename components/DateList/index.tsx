import styled from '@emotion/styled';
import { differenceInSeconds } from 'date-fns/esm';
import { Dispatch, Reducer, useReducer } from 'react';
import { ArrowRight } from 'react-feather';
import { OfferDate } from '../../lib/api/types/offer';
import { DateFormat, useDate } from '../../lib/date';
import { useLanguage, useLocale } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { useCollapsable } from '../collapsable';
import { mq } from '../globals/Constants';

const StyledDateList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const StyledDateListBody = styled.div`
  overflow: hidden;
  border-top: 1px solid var(--grey-400);
  border-bottom: 1px solid var(--grey-400);

  ${mq(Breakpoint.mid)} {
    border: 1px solid var(--grey-400);
    display: grid;
    grid-template-columns: 4.5rem repeat(4, auto);
    border-radius: 0.75rem;
  }
`;

const StyledDateListSort = styled.div``;
const StyledDateListPagination = styled.div``;

const StyledDateListTitleRow = styled.div`
  background: var(--grey-200);
  border-bottom: 1px solid var(--grey-400);
  grid-column: 1 / -1;
`;

const StyledDateListRowCell = styled.div<{ lastRow: boolean }>`
  flex-shrink: 0;

  ${mq(Breakpoint.mid)} {
    border-bottom: 1px solid var(--grey-400);
    ${({ lastRow }) => (lastRow ? 'border-bottom: none;' : '')}
  }
`;

const StyledDateListRow = styled.div<{ lastRow: boolean }>`
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid var(--grey-400);
  width: 100%;
  max-width: 100%;
  justify-content: space-between;

  ${({ lastRow }) => (lastRow ? 'border-bottom: none;' : '')}
`;

const StyledDateListRowLeft = styled.div`
  flex-grow: 0;
`;

const StyledDateListRowMid = styled.div`
  min-width: 0;
  width: 0;
  flex-basis: 0;
  flex-grow: 1;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
`;

const StyledDateListRowMidInner = styled.div`
  flex-shrink: 0;
  display: flex;
`;

const StyledDateListRowRight = styled.div`
  flex-grow: 0;
`;

const StyledDateListItemCheckbox = styled.div`
  padding: 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 1.5rem;
  }
`;

const StyledDateListItemTime = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  display: flex;
  column-gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 0;

  ${mq(Breakpoint.mid)} {
    padding: 1.5rem 0;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;
const StyledDateListItemTitle = styled.div``;
const StyledDateListItemStatus = styled.div``;
const StyledDateListItemExpand = styled.div``;

const StyledDateListItemBody = styled.div`
  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
  }
`;

const StyledDateListItemBodyInner = styled.div<{ lastRow: boolean }>`
  background: var(--grey-200);
  ${({ lastRow }) => (lastRow ? 'border-top' : 'border-bottom')}: 1px solid var(--grey-400);
`;

const StyledDateListItemBodyHeadline = styled.div``;

export enum DatesActions {
  init = 'init',
  set = 'set',
  delete = 'delete',
}

type DatesState = { [key: string]: OfferDate };

type DatesAction = {
  type: DatesActions;
  payload?: OfferDate | OfferDate[];
};

const datesReducer: Reducer<DatesState, DatesAction> = (state, action) => {
  switch (action.type) {
    case DatesActions.init: {
      return (action.payload as OfferDate[]).reduce(
        (combined, date) => ({ ...combined, [date?.data?.id]: date }),
        {}
      );
    }

    case DatesActions.set: {
      return { ...state, [(action.payload as OfferDate)?.data?.id]: action.payload };
    }

    case DatesActions.delete: {
      const updatedState = { ...state };
      delete updatedState[(action.payload as OfferDate)?.data?.id];

      return updatedState;
    }

    default: {
      break;
    }
  }
};

interface DateListItemProps {
  from: string;
  status: string;
  allDay: boolean;
  lastRow: boolean;
  to?: string;
  title?: string;
  body?: React.ReactNode;
}

const DateListRow: React.FC<DateListItemProps> = ({
  from,
  to,
  allDay,
  lastRow,
  title,
  status,
  body,
}: DateListItemProps) => {
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const uid = usePseudoUID();

  const fromDate = from && new Date(from);
  const toDate = to && new Date(to);

  const formatDate = useDate();

  const dateFormat = allDay ? DateFormat.date : DateFormat.dateTime;

  const formattedFrom = formatDate(fromDate, dateFormat);
  const formattedTo = toDate && formatDate(toDate, dateFormat);

  const longerThanOneDay = differenceInSeconds(toDate, fromDate) > 86400;

  console.log({ longerThanOneDay, time: differenceInSeconds(toDate, fromDate) });

  const { renderedCollapsable, isCollapsed, setIsCollapsed } = useCollapsable(
    <StyledDateListItemBodyInner lastRow={lastRow}>{body}</StyledDateListItemBodyInner>
  );

  const renderedGridContent = (
    <>
      <StyledDateListRowCell lastRow={lastRow}>
        <StyledDateListItemCheckbox>
          <Checkbox id={`${uid}-checkbox`} />
        </StyledDateListItemCheckbox>
      </StyledDateListRowCell>
      <StyledDateListRowCell lastRow={lastRow}>
        <StyledDateListItemTime>
          <span>{formattedFrom}</span>
          {to && (!allDay || longerThanOneDay) && (
            <>
              <ArrowRight />
              <span>{formattedTo}</span>
            </>
          )}
        </StyledDateListItemTime>
      </StyledDateListRowCell>
      <StyledDateListRowCell lastRow={lastRow}>
        <StyledDateListItemTitle>{title}</StyledDateListItemTitle>
      </StyledDateListRowCell>
      <StyledDateListRowCell lastRow={lastRow}>
        <StyledDateListItemStatus>{status}</StyledDateListItemStatus>
      </StyledDateListRowCell>
      <StyledDateListRowCell lastRow={lastRow}>
        <StyledDateListItemExpand>
          <Button onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? 'expand' : 'collapse'}
          </Button>
        </StyledDateListItemExpand>
      </StyledDateListRowCell>
      <StyledDateListItemBody>{renderedCollapsable}</StyledDateListItemBody>
    </>
  );

  const renderedFlexContent = (
    <>
      <StyledDateListRow lastRow={lastRow}>
        <StyledDateListRowLeft>
          <StyledDateListItemCheckbox>
            <Checkbox id={`${uid}-checkbox`} />
          </StyledDateListItemCheckbox>
        </StyledDateListRowLeft>
        <StyledDateListRowMid>
          <StyledDateListRowMidInner>
            <StyledDateListItemTime>
              <span>{formattedFrom}</span>
              {to && (!allDay || longerThanOneDay) && (
                <>
                  <ArrowRight />
                  <span>{formattedTo}</span>
                </>
              )}
            </StyledDateListItemTime>
            <StyledDateListItemTitle>{title}</StyledDateListItemTitle>
            <StyledDateListItemStatus>{status}</StyledDateListItemStatus>
          </StyledDateListRowMidInner>
        </StyledDateListRowMid>
        <StyledDateListRowRight>
          <StyledDateListItemExpand>
            <Button onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? 'expand' : 'collapse'}
            </Button>
          </StyledDateListItemExpand>
        </StyledDateListRowRight>
      </StyledDateListRow>
      <StyledDateListItemBody>{renderedCollapsable}</StyledDateListItemBody>
    </>
  );

  return isMidOrWider ? renderedGridContent : renderedFlexContent;
};

interface DateListProps {
  dates: OfferDate[];
  onChange?: (dates: OfferDate[]) => void;
  state?: DatesState;
  dispatch?: Dispatch<DatesAction>;
}

const DateList: React.FC<DateListProps> = ({ state, dispatch }: DateListProps) => {
  const language = useLanguage();
  const locale = useLocale();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const rowCount = Object.values(state).length;

  return (
    <StyledDateList>
      <StyledDateListSort>sorting</StyledDateListSort>
      <StyledDateListBody>
        {isMidOrWider && <StyledDateListTitleRow>title row</StyledDateListTitleRow>}
        {Object.values(state).map((date, index) => {
          const translation = getTranslation(language, date?.data?.relations?.translations);

          return (
            <DateListRow
              key={index}
              from={date?.data?.attributes?.from}
              to={date?.data?.attributes?.to}
              allDay={date?.data?.attributes?.allDay}
              status={date?.data?.attributes?.status}
              title={translation?.attributes?.name}
              lastRow={index === rowCount - 1}
              body={
                <div>
                  <StyledDateListItemBodyHeadline>headline</StyledDateListItemBodyHeadline>
                  <div>item body</div>
                </div>
              }
            />
          );
        })}
      </StyledDateListBody>
      <StyledDateListPagination>pagination</StyledDateListPagination>
    </StyledDateList>
  );
};

export const useDateList = (
  props: DateListProps
): {
  renderedDateList: React.ReactElement<DateListProps>;
} => {
  const [datesState, dispatchDates] = useReducer(
    datesReducer,
    props?.dates?.reduce((combined, date) => ({ ...combined, [date?.data?.id]: date }), {})
  );

  return { renderedDateList: <DateList state={datesState} dispatch={dispatchDates} {...props} /> };
};
