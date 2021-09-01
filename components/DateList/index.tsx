import styled from '@emotion/styled';
import { differenceInSeconds } from 'date-fns/esm';
import { Dispatch, Reducer, SetStateAction, useMemo, useReducer, useState } from 'react';
import { ArrowRight, ChevronDown } from 'react-feather';
import { OfferDate, OfferDateStatus } from '../../lib/api/types/offer';
import { DateFormat, useDate } from '../../lib/date';
import { useLanguage, useLocale } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { Checkbox } from '../checkbox';
import { useCollapsable } from '../collapsable';
import { mq } from '../globals/Constants';

const StyledDateList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
`;

const StyledDateListBody = styled.div`
  overflow: hidden;
  border-top: 1px solid var(--grey-400);
  border-bottom: 1px solid var(--grey-400);

  ${mq(Breakpoint.mid)} {
    border: 1px solid var(--grey-400);
    display: grid;
    grid-template-columns: 4.5rem 2fr 1fr 0fr 0fr;
    border-radius: 0.75rem;
  }
`;

const StyledDateListTitleRowCell = styled.div`
  background: var(--grey-200);
  border-bottom: 1px solid var(--grey-400);
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
  align-items: stretch;
  border-bottom: 1px solid var(--grey-400);
  width: 100%;
  max-width: 100%;
  justify-content: space-between;
  position: relative;

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
  padding-right: 2.25rem;
`;

const StyledDateListRowRight = styled.div`
  flex-grow: 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 2.25rem;
    background: linear-gradient(270deg, var(--white) 0%, var(--white-o0) 100%);
    top: 0;
    left: -2.25rem;
  }
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
  padding: 0.75rem 0.375rem 0.75rem 0;

  ${mq(Breakpoint.mid)} {
    padding: 1.5rem 0;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const StyledDateListItemTitle = styled.div<{ noPaddingLeft?: boolean }>`
  padding: 0.75rem 0.375rem;
  ${({ noPaddingLeft }) => (noPaddingLeft ? 'padding-left: 0;' : '')}

  ${mq(Breakpoint.mid)} {
    padding: 1.5rem 0.75rem;
    ${({ noPaddingLeft }) => (noPaddingLeft ? 'padding-left: 0;' : '')}
  }
`;

const StyledDateListItemTitleBold = styled(StyledDateListItemTitle)`
  font-weight: 700;
`;

const StyledDateListItemStatus = styled.div`
  padding: 0.75rem 0.75rem 0.75rem 0.375rem;

  ${mq(Breakpoint.mid)} {
    padding: 1.5rem 1.5rem 1.5rem 0.75rem;
  }
`;

const StyledDateListItemStatusFlag = styled.div<{ status: OfferDateStatus }>`
  padding: 0 0.375rem;
  border-radius: 0.375rem;
  background: ${({ status }) =>
    status === OfferDateStatus.confirmed ? 'var(--green-light)' : 'var(--yellow)'};
`;

const StyledDateListItemExpand = styled.button<{ isCollapsed: boolean }>`
  appearance: none;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  padding: 0.75rem;
  margin: 0;
  background: none;
  border: none;
  border-left: 1px solid var(--grey-400);
  display: flex;
  align-items: center;
  column-gap: 0.375rem;
  cursor: pointer;

  @media (pointer: fine) {
    transition: background var(--transition-duration-fast);
    background: var(--white);
  }

  &:hover {
    background: var(--grey-200);
  }

  ${mq(Breakpoint.mid)} {
    column-gap: 0.75rem;
    padding: 1.5rem;
  }

  svg {
    width: 1.125rem;
    height: 1.125rem;
    transition: transform var(--transition-duration);
    transform: rotateX(${({ isCollapsed }) => (isCollapsed ? '0deg' : '180deg')});
  }
`;

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
  status: OfferDateStatus;
  allDay: boolean;
  lastRow: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
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
  checked,
  onChange,
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

  const { renderedCollapsable, isCollapsed, setIsCollapsed } = useCollapsable(
    <StyledDateListItemBodyInner lastRow={lastRow}>{body}</StyledDateListItemBodyInner>
  );

  const renderedExpandButton = (
    <StyledDateListItemExpand
      onClick={() => setIsCollapsed(!isCollapsed)}
      isCollapsed={isCollapsed}
    >
      <span>Details</span>
      <ChevronDown />
    </StyledDateListItemExpand>
  );

  const renderedStatus = (
    <StyledDateListItemStatus>
      <StyledDateListItemStatusFlag status={status}>{status}</StyledDateListItemStatusFlag>
    </StyledDateListItemStatus>
  );

  const renderedGridContent = (
    <>
      <StyledDateListRowCell lastRow={lastRow}>
        <StyledDateListItemCheckbox>
          <Checkbox
            id={`${uid}-checkbox`}
            checked={checked}
            onChange={(e) => onChange(e?.target?.checked)}
          />
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
      <StyledDateListRowCell lastRow={lastRow}>{renderedStatus}</StyledDateListRowCell>
      <StyledDateListRowCell lastRow={lastRow}>{renderedExpandButton}</StyledDateListRowCell>
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
            {renderedStatus}
          </StyledDateListRowMidInner>
        </StyledDateListRowMid>
        <StyledDateListRowRight>{renderedExpandButton}</StyledDateListRowRight>
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
  checkedDateIds?: string[];
  setCheckedDateIds?: Dispatch<SetStateAction<string[]>>;
}

const DateList: React.FC<DateListProps> = ({
  state,
  dispatch,
  checkedDateIds,
  setCheckedDateIds,
}: DateListProps) => {
  const language = useLanguage();
  const locale = useLocale();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const rowCount = Object.values(state).length;
  const uid = usePseudoUID();

  const allDateIds = useMemo(() => Object.values(state).map((date) => date?.data?.id), [state]);

  const allCheckboxesChecked = useMemo<boolean>(() => {
    for (let i = 0; i < allDateIds.length; i += 1) {
      if (!checkedDateIds.includes(allDateIds[i])) {
        return false;
      }
    }

    return true;
  }, [checkedDateIds, allDateIds]);

  return (
    <StyledDateList>
      <StyledDateListBody>
        {isMidOrWider && (
          <>
            <StyledDateListTitleRowCell>
              <StyledDateListItemCheckbox>
                <Checkbox
                  id={`${uid}-checkbox`}
                  checked={allCheckboxesChecked}
                  onChange={(e) =>
                    e?.target.checked ? setCheckedDateIds(allDateIds) : setCheckedDateIds([])
                  }
                />
              </StyledDateListItemCheckbox>
            </StyledDateListTitleRowCell>
            <StyledDateListTitleRowCell>
              <StyledDateListItemTitleBold noPaddingLeft>Zeit</StyledDateListItemTitleBold>
            </StyledDateListTitleRowCell>
            <StyledDateListTitleRowCell>
              <StyledDateListItemTitleBold>Titel</StyledDateListItemTitleBold>
            </StyledDateListTitleRowCell>
            <StyledDateListTitleRowCell>
              <StyledDateListItemTitleBold>Status</StyledDateListItemTitleBold>
            </StyledDateListTitleRowCell>
            <StyledDateListTitleRowCell />
          </>
        )}
        {Object.values(state).map((date, index) => {
          const translation = getTranslation(language, date?.data?.relations?.translations);
          const dateId = date?.data?.id;

          return (
            <DateListRow
              key={index}
              from={date?.data?.attributes?.from}
              to={date?.data?.attributes?.to}
              allDay={date?.data?.attributes?.allDay}
              status={date?.data?.attributes?.status}
              title={translation?.attributes?.name}
              lastRow={index === rowCount - 1}
              checked={checkedDateIds?.includes(dateId)}
              onChange={(checked) => {
                if (checkedDateIds) {
                  if (checked) {
                    setCheckedDateIds([...checkedDateIds.filter((id) => id !== dateId), dateId]);
                  } else {
                    setCheckedDateIds(checkedDateIds.filter((id) => id !== dateId));
                  }
                }
              }}
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
    </StyledDateList>
  );
};

export const useDateList = (
  props: DateListProps
): {
  renderedDateList: React.ReactElement<DateListProps>;
  checkedDateIds: string[];
} => {
  const [datesState, dispatchDates] = useReducer(
    datesReducer,
    props?.dates?.reduce((combined, date) => ({ ...combined, [date?.data?.id]: date }), {})
  );

  const [checkedDateIds, setCheckedDateIds] = useState<string[]>([]);

  return {
    renderedDateList: (
      <DateList
        state={datesState}
        dispatch={dispatchDates}
        checkedDateIds={checkedDateIds}
        setCheckedDateIds={setCheckedDateIds}
        {...props}
      />
    ),
    checkedDateIds,
  };
};
