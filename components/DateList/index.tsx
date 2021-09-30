import styled from '@emotion/styled';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Language } from '../../config/locale';
import { OfferDate } from '../../lib/api/types/offer';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
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

enum DateListActions {
  init = 'init',
  edit = 'edit',
  delete = 'delete',
}

interface DateListProps {
  dates: OfferDate['data'][];
  editable?: boolean;
  onChange?: (dates: OfferDate['data'][], dateId: number) => void;
  checkedDateIds?: string[];
  setCheckedDateIds?: Dispatch<SetStateAction<string[]>>;
  offerTitles: { [key in Language]: string };
}

const DateList: React.FC<DateListProps> = ({
  dates,
  onChange,
  checkedDateIds,
  setCheckedDateIds,
  editable = true,
  offerTitles,
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
      <StyledDateListBody role="table">
        {isWideOrWider ? (
          <>
            <StyledDateListTitleRowCell>
              {editable && (
                <StyledDateListItemCheckbox>
                  <Checkbox
                    id={`${uid}-checkbox`}
                    checked={allCheckboxesChecked}
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
                  checked={allCheckboxesChecked}
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
        {dates?.map((date, index) => {
          const dateId = date?.id;
          return (
            <DateListItem
              key={index}
              date={date}
              onChange={(changedDate) =>
                onChange(
                  [...dates.slice(0, index), changedDate, ...dates.slice(index + 1, dates.length)],
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
  const [checkedDateIds, setCheckedDateIds] = useState<string[]>([]);

  return {
    renderedDateList: (
      <DateList checkedDateIds={checkedDateIds} setCheckedDateIds={setCheckedDateIds} {...props} />
    ),
    checkedDateIds,
  };
};
