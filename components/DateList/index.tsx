import styled from '@emotion/styled';
import { Dispatch, Reducer, useReducer } from 'react';
import { OfferDate } from '../../lib/api/types/offer';
import { useLanguage, useLocale } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { Button } from '../button';
import { useCollapsable } from '../collapsable';

const StyledDateList = styled.div``;

const StyledDateListBody = styled.div``;
const StyledDateListSort = styled.div``;
const StyledDateListPagination = styled.div``;

const StyledDateListTitleRow = styled.div``;

const StyledDateListItem = styled.div``;
const StyledDateListItemCheckbox = styled.div``;
const StyledDateListItemTime = styled.div``;
const StyledDateListItemTitle = styled.div``;
const StyledDateListItemStatus = styled.div``;
const StyledDateListItemExpand = styled.div``;
const StyledDateListItemBody = styled.div``;
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
  to?: string;
  title?: string;
  body?: React.ReactNode;
}

const DateListItem: React.FC<DateListItemProps> = ({
  from,
  to,
  title,
  status,
  body,
}: DateListItemProps) => {
  const { renderedCollapsable, isCollapsed, setIsCollapsed } = useCollapsable(
    <StyledDateListItemBody>{body}</StyledDateListItemBody>
  );

  return (
    <StyledDateListItem>
      <StyledDateListItemCheckbox>[ ]</StyledDateListItemCheckbox>
      <StyledDateListItemTime>
        {from} {'->'} {to}
      </StyledDateListItemTime>
      <StyledDateListItemTitle>{title}</StyledDateListItemTitle>
      <StyledDateListItemStatus>{status}</StyledDateListItemStatus>
      <StyledDateListItemExpand>
        <Button onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? 'expand' : 'collapse'}
        </Button>
      </StyledDateListItemExpand>
      {renderedCollapsable}
    </StyledDateListItem>
  );
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

  return (
    <StyledDateList>
      <StyledDateListSort>sorting</StyledDateListSort>
      <StyledDateListBody>
        <StyledDateListTitleRow>title row</StyledDateListTitleRow>
        {Object.values(state).map((date, index) => {
          const translation = getTranslation(language, date?.data?.relations?.translations);

          return (
            <DateListItem
              key={index}
              from={`${date?.data?.attributes?.from?.toLocaleDateString(
                locale
              )} ${date?.data?.attributes?.from?.toLocaleTimeString(locale)}`}
              to={`${date?.data?.attributes?.to?.toLocaleDateString(
                locale
              )} ${date?.data?.attributes?.to?.toLocaleTimeString(locale)}`}
              status={date?.data?.attributes?.status}
              title={translation?.attributes?.name}
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
