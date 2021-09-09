import styled from '@emotion/styled';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
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

const StyledDateListBody = styled.div<{ hideCheckboxes: boolean }>`
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
  dates: OfferDate[];
  hideCheckboxes?: boolean;
  onChange?: (dates: OfferDate[]) => void;
  checkedDateIds?: string[];
  setCheckedDateIds?: Dispatch<SetStateAction<string[]>>;
}

const DateList: React.FC<DateListProps> = ({
  dates,
  checkedDateIds,
  setCheckedDateIds,
  hideCheckboxes = false,
}: DateListProps) => {
  const isWideOrWider = useBreakpointOrWider(Breakpoint.widish);
  const rowCount = dates.length;
  const uid = usePseudoUID();
  const t = useT();

  const allDateIds = useMemo(() => dates.map((date) => date?.data?.id), [dates]);

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
      <StyledDateListBody role="table" hideCheckboxes={hideCheckboxes}>
        {isWideOrWider ? (
          <>
            <StyledDateListTitleRowCell>
              {!hideCheckboxes && (
                <StyledDateListItemCheckbox>
                  <Checkbox
                    id={`${uid}-checkbox`}
                    checked={allCheckboxesChecked}
                    onChange={(e) =>
                      e?.target.checked ? setCheckedDateIds(allDateIds) : setCheckedDateIds([])
                    }
                  />
                </StyledDateListItemCheckbox>
              )}
            </StyledDateListTitleRowCell>
            <StyledDateListTitleRowCell>
              <StyledDateListItemTextBold
                noPaddingLeft={!hideCheckboxes}
                doublePaddingLeft={hideCheckboxes}
              >
                {t('dateList.from')}
              </StyledDateListItemTextBold>
            </StyledDateListTitleRowCell>
            <StyledDateListTitleRowCell>
              <StyledDateListItemTextBold>{t('dateList.to')}</StyledDateListItemTextBold>
            </StyledDateListTitleRowCell>
            <StyledDateListTitleRowCell>
              <StyledDateListItemTextBold>{t('dateList.title')}</StyledDateListItemTextBold>
            </StyledDateListTitleRowCell>
            <StyledDateListTitleRowCell>
              <StyledDateListItemTextBold>{t('dateList.status')}</StyledDateListItemTextBold>
            </StyledDateListTitleRowCell>
            <StyledDateListTitleRowCell />
          </>
        ) : (
          <StyledDateListTitleRow>
            {!hideCheckboxes && (
              <StyledDateListItemCheckbox>
                <Checkbox
                  id={`${uid}-checkbox`}
                  ariaLabel={t('dateList.allCheckboxAriaLabel') as string}
                  checked={allCheckboxesChecked}
                  onChange={(e) =>
                    e?.target.checked ? setCheckedDateIds(allDateIds) : setCheckedDateIds([])
                  }
                />
              </StyledDateListItemCheckbox>
            )}
            <StyledDateListItemTextBold
              noPaddingLeft={!hideCheckboxes}
              doublePaddingLeft={hideCheckboxes}
            >
              {t('dateList.info')}
            </StyledDateListItemTextBold>
          </StyledDateListTitleRow>
        )}
        {dates.map((date, index) => {
          const dateId = date?.data?.id;
          return (
            <DateListItem
              key={index}
              date={date}
              checked={checkedDateIds?.includes(dateId)}
              setChecked={(checked) => {
                if (checked) {
                  setCheckedDateIds([...checkedDateIds.filter((id) => id !== dateId), dateId]);
                } else {
                  setCheckedDateIds(checkedDateIds.filter((id) => id !== dateId));
                }
              }}
              editable={!hideCheckboxes}
              lastRow={index === rowCount - 1}
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
