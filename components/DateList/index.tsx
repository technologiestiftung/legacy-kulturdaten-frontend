import styled from '@emotion/styled';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Language } from '../../config/locale';
import { OfferDate } from '../../lib/api/types/offer';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { Button, ButtonColor, ButtonVariant } from '../button';
import { Checkbox } from '../checkbox';
import { mq } from '../globals/Constants';
import { DateListItem } from './DateListItem';

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
    border-radius: 0.75rem;
  }

  ${mq(Breakpoint.widish)} {
    display: grid;
    grid-template-columns: auto 1fr 1fr 1fr auto auto;
  }
`;

const StyledDateListTitleRowCell = styled.div`
  border-bottom: 1px solid var(--grey-400);
`;

const StyledDateListTitleRow = styled(StyledDateListTitleRowCell)`
  display: flex;
`;

const StyledDateListItemCheckbox = styled.div`
  padding: 0.75rem;
  align-self: center;

  ${mq(Breakpoint.ultra)} {
    padding: 1.5rem;
  }
`;

const StyledDateListItemText = styled.div<{ noPaddingLeft?: boolean; doublePaddingLeft?: boolean }>`
  align-self: center;
  padding: 0.75rem 0.375rem;
  ${({ noPaddingLeft, doublePaddingLeft }) =>
    noPaddingLeft ? 'padding-left: 0;' : doublePaddingLeft ? 'padding-left: 0.75rem;' : ''}

  ${mq(Breakpoint.ultra)} {
    padding: 1.5rem 0.75rem;
    ${({ noPaddingLeft, doublePaddingLeft }) =>
      noPaddingLeft ? 'padding-left: 0;' : doublePaddingLeft ? 'padding-left: 1.5rem;' : ''}
  }
`;

const StyledDateListItemTextBold = styled(StyledDateListItemText)`
  font-weight: 700;
`;

const StyledDateListPlaceholder = styled.div`
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

const StyledDateListSelectCount = styled.div`
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

interface DateListProps {
  dates: OfferDate['data'][];
  editable?: boolean;
  onChange?: (dates: OfferDate['data'][], dateId: number) => void;
  checkedDateIds?: string[];
  setCheckedDateIds?: Dispatch<SetStateAction<string[]>>;
  offerTitles: { [key in Language]: string };
  onDelete?: (dateIds: OfferDate['data']['id'][]) => void;
}

const DateList: React.FC<DateListProps> = ({
  dates,
  onChange,
  checkedDateIds,
  setCheckedDateIds,
  editable = true,
  offerTitles,
  onDelete,
}: DateListProps) => {
  const isWideOrWider = useBreakpointOrWider(Breakpoint.widish);
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
      <StyledDateListBody role="table">
        {isWideOrWider ? (
          <>
            <StyledDateListTitleRowCell>
              {editable && (
                <StyledDateListItemCheckbox>
                  <Checkbox
                    id={`${uid}-checkbox`}
                    checked={dates?.length > 0 && allCheckboxesChecked}
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
              <StyledDateListItemTextBold noPaddingLeft={editable} doublePaddingLeft={!editable}>
                {t('date.from')}
              </StyledDateListItemTextBold>
            </StyledDateListTitleRowCell>
            <StyledDateListTitleRowCell>
              <StyledDateListItemTextBold>{t('date.to')}</StyledDateListItemTextBold>
            </StyledDateListTitleRowCell>
            <StyledDateListTitleRowCell>
              <StyledDateListItemTextBold>{t('date.title')}</StyledDateListItemTextBold>
            </StyledDateListTitleRowCell>
            <StyledDateListTitleRowCell>
              <StyledDateListItemTextBold>{t('date.status')}</StyledDateListItemTextBold>
            </StyledDateListTitleRowCell>
            <StyledDateListTitleRowCell />
          </>
        ) : (
          <StyledDateListTitleRow>
            {editable && (
              <StyledDateListItemCheckbox>
                <Checkbox
                  id={`${uid}-checkbox`}
                  ariaLabel={t('date.allCheckboxAriaLabel') as string}
                  checked={dates?.length > 0 && allCheckboxesChecked}
                  onChange={(e) =>
                    e?.target.checked
                      ? setCheckedDateIds(allDateIds.map((dateId) => String(dateId)))
                      : setCheckedDateIds([])
                  }
                />
              </StyledDateListItemCheckbox>
            )}
            <StyledDateListItemTextBold noPaddingLeft={editable} doublePaddingLeft={!editable}>
              {t('date.info')}
            </StyledDateListItemTextBold>
          </StyledDateListTitleRow>
        )}
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
          <StyledDateListPlaceholder>{t('date.listPlaceholder')}</StyledDateListPlaceholder>
        )}
      </StyledDateListBody>
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
