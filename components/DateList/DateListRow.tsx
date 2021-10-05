import styled from '@emotion/styled';
import { differenceInSeconds } from 'date-fns';
import { ArrowRight, ChevronDown } from 'react-feather';
import { OfferDateStatus } from '../../lib/api/types/offer';
import { DateFormat, useDate } from '../../lib/date';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { Checkbox } from '../checkbox';
import { useCollapsable } from '../collapsable';
import { mq } from '../globals/Constants';

const StyledDateListRowCell = styled.div<{ lastRow: boolean; expanded: boolean }>`
  flex-shrink: 0;
  display: flex;
  align-items: stretch;

  background: ${({ expanded }) => (expanded ? 'var(--grey-200)' : 'transparent')};

  ${mq(Breakpoint.widish)} {
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
  align-self: center;

  ${mq(Breakpoint.ultra)} {
    padding: 1.5rem;
  }
`;

const StyledDateListItemTimeFrom = styled.span`
  /* font-weight: 700; */
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

const StyledDateListItemTime = styled(StyledDateListItemText)`
  display: flex;
  column-gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 0.375rem 0.75rem 0;

  ${({ noPaddingLeft, doublePaddingLeft }) =>
    noPaddingLeft ? 'padding-left: 0;' : doublePaddingLeft ? 'padding-left: 0.75rem;' : ''}

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const StyledDateListItemStatus = styled.div`
  padding: 0.75rem 0.75rem 0.75rem 0.375rem;
  display: flex;
  align-self: center;

  ${mq(Breakpoint.ultra)} {
    padding: 1.5rem 1.5rem 1.5rem 0.75rem;
  }
`;

const StyledDateListItemStatusFlag = styled.div<{ status: OfferDateStatus; disabled?: boolean }>`
  padding: 0 0.375rem;
  border-radius: 0.375rem;
  background: ${({ status, disabled }) =>
    disabled
      ? 'var(--grey-350)'
      : status === OfferDateStatus.scheduled
      ? 'var(--green-light)'
      : 'var(--error-light)'};
`;

const StyledDateListItemExpand = styled.button<{ isCollapsed: boolean }>`
  appearance: none;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  padding: 0.75rem;
  margin: 0;
  background: transparent;
  border: none;
  border-left: 1px solid var(--grey-400);
  display: flex;
  align-items: center;
  column-gap: 0.375rem;
  cursor: pointer;

  @media (pointer: fine) {
    transition: background var(--transition-duration-fast);
  }

  &:hover {
    background: var(--grey-200);
  }

  ${mq(Breakpoint.ultra)} {
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
  ${mq(Breakpoint.widish)} {
    grid-column: 1 / -1;
  }
`;

const StyledDateListItemBodyInner = styled.div<{ lastRow: boolean }>`
  background: var(--grey-200);
  ${({ lastRow }) => (lastRow ? 'border-top' : 'border-bottom')}: 1px solid var(--grey-400);
`;

interface DateListRowProps {
  from: string;
  status: OfferDateStatus;
  isAllDay: boolean;
  lastRow: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
  to?: string;
  title?: string;
  body?: React.ReactNode;
  editable?: boolean;
  disabled?: boolean;
}

const OfferDateStatusToL10nMap: (editable: boolean) => { [key in OfferDateStatus]: string } = (
  editable
) => ({
  [OfferDateStatus.scheduled]: editable ? 'date.scheduled' : 'date.scheduledArchived',
  [OfferDateStatus.canceled]: 'date.canceled',
});

export const DateListRow: React.FC<DateListRowProps> = ({
  from,
  to,
  isAllDay,
  lastRow,
  title,
  status,
  body,
  checked,
  onChange,
  editable = true,
  disabled,
}: DateListRowProps) => {
  const isWideOrWider = useBreakpointOrWider(Breakpoint.widish);
  const uid = usePseudoUID();
  const t = useT();
  const formatDate = useDate();

  const fromDate = from && new Date(from);
  const toDate = to && new Date(to);

  const dateFormat = isAllDay ? DateFormat.date : DateFormat.dateTime;

  const formattedFrom = formatDate(fromDate, dateFormat);
  const formattedTo = toDate && formatDate(toDate, dateFormat);

  const longerThanOneDay = differenceInSeconds(toDate, fromDate) > 86400;

  const { renderedCollapsable, isCollapsed, setIsCollapsed } = useCollapsable(
    <StyledDateListItemBodyInner lastRow={lastRow}>{body}</StyledDateListItemBodyInner>
  );

  const expanded = !isCollapsed;

  const renderedExpandButton = (
    <StyledDateListItemExpand
      onClick={() => setIsCollapsed(!isCollapsed)}
      isCollapsed={isCollapsed}
      aria-label={
        isCollapsed
          ? (t('date.detailsShowAriaLabel') as string)
          : (t('date.detailsHideAriaLabel') as string)
      }
    >
      <span>{t('date.details')}</span>
      <ChevronDown />
    </StyledDateListItemExpand>
  );

  const renderedStatus = (
    <StyledDateListItemStatus>
      <StyledDateListItemStatusFlag status={status} disabled={disabled}>
        {status ? t(OfferDateStatusToL10nMap(editable)[status]) : ''}
      </StyledDateListItemStatusFlag>
    </StyledDateListItemStatus>
  );

  const renderedCheckbox = (
    <StyledDateListItemCheckbox>
      <Checkbox
        ariaLabel={t('date.checkboxAriaLabel') as string}
        id={`${uid}-checkbox`}
        checked={checked}
        onChange={(e) => onChange(e?.target?.checked)}
      />
    </StyledDateListItemCheckbox>
  );

  const renderedGridContent = (
    <>
      <StyledDateListRowCell lastRow={lastRow} expanded={expanded}>
        {editable && renderedCheckbox}
      </StyledDateListRowCell>

      <StyledDateListRowCell lastRow={lastRow} expanded={expanded}>
        <StyledDateListItemText noPaddingLeft={editable} doublePaddingLeft={!editable}>
          <StyledDateListItemTimeFrom>{formattedFrom}</StyledDateListItemTimeFrom>
        </StyledDateListItemText>
      </StyledDateListRowCell>
      <StyledDateListRowCell lastRow={lastRow} expanded={expanded}>
        {to && (!isAllDay || longerThanOneDay) && (
          <StyledDateListItemText>{formattedTo}</StyledDateListItemText>
        )}
      </StyledDateListRowCell>
      <StyledDateListRowCell lastRow={lastRow} expanded={expanded}>
        <StyledDateListItemText>{title}</StyledDateListItemText>
      </StyledDateListRowCell>
      <StyledDateListRowCell lastRow={lastRow} expanded={expanded}>
        {renderedStatus}
      </StyledDateListRowCell>
      <StyledDateListRowCell lastRow={lastRow} expanded={expanded}>
        {renderedExpandButton}
      </StyledDateListRowCell>
      <StyledDateListItemBody>{renderedCollapsable}</StyledDateListItemBody>
    </>
  );

  const renderedFlexContent = (
    <>
      <StyledDateListRow lastRow={lastRow}>
        <StyledDateListRowLeft>{editable && renderedCheckbox}</StyledDateListRowLeft>
        <StyledDateListRowMid>
          <StyledDateListRowMidInner>
            <StyledDateListItemTime noPaddingLeft={editable} doublePaddingLeft={!editable}>
              <span>{formattedFrom}</span>
              {to && (!isAllDay || longerThanOneDay) && (
                <>
                  <ArrowRight />
                  <span>{formattedTo}</span>
                </>
              )}
            </StyledDateListItemTime>
            <StyledDateListItemText>{title}</StyledDateListItemText>
            {renderedStatus}
          </StyledDateListRowMidInner>
        </StyledDateListRowMid>
        <StyledDateListRowRight>{renderedExpandButton}</StyledDateListRowRight>
      </StyledDateListRow>
      <StyledDateListItemBody>{renderedCollapsable}</StyledDateListItemBody>
    </>
  );

  return isWideOrWider ? renderedGridContent : renderedFlexContent;
};
