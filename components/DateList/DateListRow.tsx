import styled from '@emotion/styled';
import { ChevronDown } from 'react-feather';
import { OfferDateStatus } from '../../lib/api/types/offer';
import { DateFormat, useDate } from '../../lib/date';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint } from '../../lib/WindowService';
import { Checkbox } from '../checkbox';
import { useCollapsable } from '../collapsable';
import { mq } from '../globals/Constants';
import { DateStatusFlag } from './DateStatusFlag';

const StyledDateListRowCell = styled.td<{ lastRow: boolean; expanded: boolean }>`
  flex-shrink: 0;
  display: flex;

  background: ${({ expanded }) => (expanded ? 'var(--grey-200)' : 'transparent')};

  width: 185px;
  ${mq(Breakpoint.ultra)} {
    width: 195px;
  }

  &:nth-of-type(1) {
    width: 48px;
    ${mq(Breakpoint.ultra)} {
      width: 72px;
    }
  }

  &:nth-of-type(4) {
    width: calc(100% - 612px);
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
    width: 92px;
    ${mq(Breakpoint.ultra)} {
      width: 128px;
    }
  }
  
`;

const StyledDateListRow = styled.tr`
  display: flex;
  align-items: stretch;
  width: 100%;
  max-width: 100%;
  justify-content: flex-start;
  position: relative;
  border-top: 1px solid var(--grey-400);
  &:first-of-kind, &:last-of-kind {
    border-top: 0px solid var(--grey-400);
  }
`;

const StyledDateListRowNoBorder = styled(StyledDateListRow)`
    border-top: 0px solid var(--grey-400);
`;

const StyledDateListItemCheckbox = styled.div`
  padding: 0.75rem;
  align-self: center;

  ${mq(Breakpoint.ultra)} {
    padding: 1.5rem;
  }
`;


const StyledDateListItemText = styled.span<{ noPaddingLeft?: boolean; doublePaddingLeft?: boolean }>`
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


const StyledDateListItemStatus = styled.div`
  padding: 0.75rem 0.75rem 0.75rem 0.375rem;
  display: flex;
  align-self: center;

  ${mq(Breakpoint.ultra)} {
    padding: 1.5rem 1.5rem 1.5rem 0.75rem;
  }
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
  color: inherit;
  width: 100%;

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
  width: 100%;
`;

const StyledDateListItemBodyInner = styled.div<{ lastRow: boolean }>`
  background: var(--grey-200);
  ${({ lastRow }) => (lastRow ? 'border-top' : 'border-bottom')}: 1px solid var(--grey-400);
`;

interface DateListRowProps {
  from: string;
  status: OfferDateStatus;
  lastRow: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
  to?: string;
  title?: string;
  body?: React.ReactNode;
  editable?: boolean;
  disabled?: boolean;
}

export const DateListRow: React.FC<DateListRowProps> = ({
  from,
  to,
  lastRow,
  title,
  status,
  body,
  checked,
  onChange,
  editable = true,
  disabled,
}: DateListRowProps) => {
  const uid = usePseudoUID();
  const t = useT();
  const formatDate = useDate();

  const fromDate = from && new Date(from);
  const toDate = to && new Date(to);

  const dateFormat = DateFormat.dayDateTime;

  const formattedFrom = `${formatDate(fromDate, dateFormat)}`;
  const formattedTo = `${toDate && formatDate(toDate, dateFormat)}`;

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
      <DateStatusFlag status={status} disabled={disabled} editable={editable} />
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
      <StyledDateListRow>
        <StyledDateListRowCell lastRow={lastRow} expanded={expanded}>
          {editable && renderedCheckbox}
        </StyledDateListRowCell>

        <StyledDateListRowCell lastRow={lastRow} expanded={expanded}>
          <StyledDateListItemText noPaddingLeft={editable} doublePaddingLeft={!editable}>
            {formattedFrom}
          </StyledDateListItemText>
        </StyledDateListRowCell>
        <StyledDateListRowCell lastRow={lastRow} expanded={expanded}>
          {to && <StyledDateListItemText>
            {formattedTo}
            </StyledDateListItemText>}
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
      </StyledDateListRow>
      <StyledDateListRowNoBorder>
        <StyledDateListItemBody>{renderedCollapsable}</StyledDateListItemBody>
      </StyledDateListRowNoBorder>
    </>
  );

  return renderedGridContent;
};
