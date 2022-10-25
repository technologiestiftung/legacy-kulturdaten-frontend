import styled from '@emotion/styled';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp } from 'react-feather';
import { dateListRef } from '../../config/categories';
import { Language } from '../../config/locale';
import { OfferDate } from '../../lib/api/types/offer';
import { Order } from '../../lib/categories';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { Button, ButtonColor, ButtonVariant } from '../button';
import { Checkbox } from '../checkbox';
import { mq } from '../globals/Constants';
import { StyledCellSort } from '../table';
import { DateListItem } from './DateListItem';

const StyledDateList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  width: 100%;
  overflow: hidden;
  `;

const StyledDateListTitleRow = styled.tr`
  display: flex;
  align-items: stretch;
  width: 100%;
  width: 100%;
  justify-content: flex-start;
  position: relative;
  overflow: auto;
`;

const DateListScrollContainer = styled.span`
  border: 1px solid var(--grey-400);
  width: 100%;
  border-radius: 0.75rem;
  overflow: auto;
`;

const StyledDateListBody = styled.table`
  border-radius: 0.75rem;
  border-collapse: separate;
  min-width: 100%;
`;

export const StyledDateListTitleRowCell = styled.th`
  border-bottom: 1px solid var(--grey-400);
  background: var(--grey-200);
  display: flex;

  width: 185px;
  ${mq(Breakpoint.ultra)} {
    width: 195px;
  }

  &:nth-of-type(1) {
    width: 48px;
    border-radius: 0.75rem 0 0 0;
    ${mq(Breakpoint.ultra)} {
      width: 72px;
    }
  }

  &:nth-of-type(3) {
    padding-left: 0.375em;
    ${mq(Breakpoint.ultra)} {
      padding-left: 0;
    }
  }

  &:nth-of-type(4) {
    width: calc(100% - 610px);
    min-width: 150px;
    ${mq(Breakpoint.ultra)} {
      width: calc(100% - 710px);
    }
  }

  &:nth-of-type(5) {
    width:100px;
    ${mq(Breakpoint.ultra)} {
      width: 120px;
    }
  }
  
  &:nth-of-type(6) {
    width: 92.6px;
    border-radius: 0 0.75rem 0 0;
    ${mq(Breakpoint.ultra)} {
      width: 128px;
    }
  }
`;

const StyledDateListItemCheckbox = styled.span`
  padding: 0.75rem;
  align-self: center;

  ${mq(Breakpoint.ultra)} {
    padding: 1.5rem;
  }
`;

const StyledDateListItemText = styled.span<{
  noPaddingLeft?: boolean;
  doublePaddingLeft?: boolean;
  lessVerticalPadding?: boolean;
}>`
  align-self: center;
  text-align: left;
  padding: ${({ lessVerticalPadding }) =>
    lessVerticalPadding ? '0.5625rem 0.375rem' : '0.75rem 0.375rem'};
  ${({ noPaddingLeft, doublePaddingLeft }) =>
    noPaddingLeft ? 'padding-left: 0;' : doublePaddingLeft ? 'padding-left: 0.75rem;' : ''}

  ${mq(Breakpoint.ultra)} {
    padding: ${({ lessVerticalPadding }) =>
    lessVerticalPadding ? '1.3125rem 0.75rem' : '1.5rem 0.75rem'};
    ${({ noPaddingLeft, doublePaddingLeft }) =>
    noPaddingLeft ? 'padding-left: 0!important;' : doublePaddingLeft ? 'padding-left: 1.5rem;' : ''}
  }
`;

const StyledDateListItemTextBold = styled(StyledDateListItemText)`
  font-weight: 700;
`;

const StyledDateListPlaceholder = styled.p`
  padding: 0.75rem;
  grid-column: 1 / -1;
`;

const StyledDateListSelect = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.75rem;
  row-gap: 0.75rem;
  padding: 0.75rem;
`;

const StyledDateListSelectCount = styled.p`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  padding: 0.375rem 0;
`;

const StyledDateListSelectActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.75rem;
  row-gap: 0.75rem;
`;

const StyledDateListSelectAction = styled.div``;

const StyledHiddenCaption = styled.caption`
  visibility: hidden;
  max-height: 0;
`;


interface DateListProps {
  dates: OfferDate['data'][];
  editable?: boolean;
  onChange?: (dates: OfferDate['data'][], dateId: number) => void;
  checkedDateIds?: string[];
  setCheckedDateIds?: Dispatch<SetStateAction<string[]>>;
  offerTitles: { [key in Language]: string };
  onDelete?: (dateIds: OfferDate['data']['id'][]) => void;
  fromSort?: {
    order: Order;
    onClick: () => void;
    active: boolean;
  };
  endSort?: {
    order: Order;
    onClick: () => void;
    active: boolean;
  };
}

const DateList: React.FC<DateListProps> = ({
  dates,
  onChange,
  checkedDateIds,
  setCheckedDateIds,
  editable = true,
  offerTitles,
  onDelete,
  fromSort,
  endSort,
}: DateListProps) => {
  const isUltraOrWider = useBreakpointOrWider(Breakpoint.ultra);
  const rowCount = dates?.length;
  const uid = usePseudoUID();
  const t = useT();

  const allDateIds = useMemo(() => dates?.map((date) => date?.id), [dates]);

  const allCheckboxesChecked = useMemo<boolean>(() => {
    if (allDateIds) {
      for (let i = 0; i < allDateIds.length; i += 1) {
        if (!checkedDateIds.includes(String(allDateIds[i]))) {
          return false;
        }
      }
      return true;
    }
    return false;
  }, [checkedDateIds, allDateIds]);

  return (
    <StyledDateList>
      {editable && (
        <StyledDateListSelect>
          <StyledDateListSelectCount>
            {t('date.selectedCount', { count: checkedDateIds.length })}
          </StyledDateListSelectCount>
          <StyledDateListSelectActions>
            <StyledDateListSelectAction>
              <Button
                onClick={() => onDelete(checkedDateIds.map((id) => parseInt(id, 10)))}
                disabled={checkedDateIds.length === 0}
                variant={ButtonVariant.minimal}
                color={ButtonColor.white}
              >
                {t('date.selectedDelete')}
              </Button>
            </StyledDateListSelectAction>
          </StyledDateListSelectActions>
        </StyledDateListSelect>
      )}
      <DateListScrollContainer>
        <StyledDateListBody ref={dateListRef} tabIndex={0}>
          <StyledHiddenCaption>{editable ? t('date.currentDates') as string : t('date.archivedDates') as string}</StyledHiddenCaption>
          <thead>
            <StyledDateListTitleRow>
              <StyledDateListTitleRowCell>
                {editable && (
                  <StyledDateListItemCheckbox>
                    <Checkbox
                      id={`${uid}-checkbox`}
                      checked={dates?.length > 0 && allCheckboxesChecked}
                      ariaLabel={t('date.allCheckboxAriaLabel') as string}
                      onChange={(e) =>
                        e?.target.checked
                          ? setCheckedDateIds(allDateIds.map((dateId) => String(dateId)))
                          : setCheckedDateIds([])
                      }
                    />
                  </StyledDateListItemCheckbox>
                )}
              </StyledDateListTitleRowCell>
              <StyledDateListTitleRowCell>
                <StyledDateListItemTextBold lessVerticalPadding noPaddingLeft={isUltraOrWider}>
                  {editable && fromSort ? (
                    <StyledCellSort
                      active={fromSort?.active}
                      onClick={fromSort?.onClick}
                      aria-label={
                        t('date.fromMorePrecise') as string + ": " +
                        t('general.sorting', {
                          order: fromSort?.active
                            ? fromSort?.order === Order.ASC
                              ? Order.DESC
                              : Order.ASC
                            : fromSort?.order,
                          attribute: t('date.from') as string,
                        }) as string
                      }
                    >
                      <span>{t('date.fromMorePrecise')}</span>
                      {fromSort?.order === Order.ASC ? <ArrowUp /> : <ArrowDown />}
                    </StyledCellSort>
                  ) : (
                    t('date.from')
                  )}
                </StyledDateListItemTextBold>
              </StyledDateListTitleRowCell>
              <StyledDateListTitleRowCell>
                <StyledDateListItemTextBold lessVerticalPadding>
                  {editable && fromSort ? (
                    <StyledCellSort
                      active={endSort?.active}
                      onClick={endSort?.onClick}
                      aria-label={
                        t('date.toMorePrecise') as string + ": " +
                        t('general.sorting', {
                          order: endSort?.active
                            ? endSort?.order === Order.ASC
                              ? Order.DESC
                              : Order.ASC
                            : endSort?.order,
                          attribute: t('date.to') as string,
                        }) as string
                      }
                    >
                      <span>{t('date.toMorePrecise')}</span>
                      {endSort?.order === Order.ASC ? <ArrowUp /> : <ArrowDown />}
                    </StyledCellSort>
                  ) : (
                    t('date.to')
                  )}
                </StyledDateListItemTextBold>
              </StyledDateListTitleRowCell>
              <StyledDateListTitleRowCell>
                <StyledDateListItemTextBold>{t('date.title')}</StyledDateListItemTextBold>
              </StyledDateListTitleRowCell>
              <StyledDateListTitleRowCell>
                <StyledDateListItemTextBold>{t('date.status')}</StyledDateListItemTextBold>
              </StyledDateListTitleRowCell>
              <StyledDateListTitleRowCell />
            </StyledDateListTitleRow>
          </thead>

          <tbody>
            {dates && dates.length > 0 ? (
              dates.map((date, index) => {
                const dateId = date?.id;
                return (
                  <DateListItem
                    key={index}
                    date={date}
                    onChange={(changedDate) =>
                      onChange(
                        [
                          ...dates.slice(0, index),
                          changedDate,
                          ...dates.slice(index + 1, dates.length),
                        ],
                        date.id
                      )
                    }
                    checked={checkedDateIds?.includes(String(dateId))}
                    setChecked={(checked) => {
                      if (checked) {
                        setCheckedDateIds([
                          ...checkedDateIds.filter((id) => id !== String(dateId)),
                          String(dateId),
                        ]);
                      } else {
                        setCheckedDateIds(checkedDateIds.filter((id) => id !== String(dateId)));
                      }
                    }}
                    editable={editable}
                    lastRow={index === rowCount - 1}
                    offerTitles={offerTitles}
                    onDelete={editable && onDelete ? (dateId) => onDelete([dateId]) : undefined}
                  />
                );
              })
            ) : (

              <StyledDateListTitleRow>
                <td>
                  <StyledDateListPlaceholder>
                    {t('date.listPlaceholder')}
                  </StyledDateListPlaceholder>
                </td>
              </StyledDateListTitleRow>
            )}
          </tbody>
        </StyledDateListBody>
      </DateListScrollContainer>
    </StyledDateList>
  );
};

export const useDateList = (
  props: DateListProps
): {
  renderedDateList: React.ReactElement<DateListProps>;
  checkedDateIds: string[];
  setCheckedDateIds: (checkedDateIds: string[]) => void;
} => {
  const [checkedDateIds, setCheckedDateIds] = useState<string[]>([]);

  return {
    renderedDateList: (
      <DateList checkedDateIds={checkedDateIds} setCheckedDateIds={setCheckedDateIds} {...props} />
    ),
    checkedDateIds,
    setCheckedDateIds,
  };
};
