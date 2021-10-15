import styled from '@emotion/styled';
import { OfferDateStatus } from '../../lib/api/types/offer';
import { useT } from '../../lib/i18n';

const OfferDateStatusToL10nMap: (editable: boolean) => { [key in OfferDateStatus]: string } = (
  editable
) => ({
  [OfferDateStatus.scheduled]: editable ? 'date.scheduled' : 'date.scheduledArchived',
  [OfferDateStatus.canceled]: 'date.canceled',
  [OfferDateStatus.past]: 'date.past',
});

const StyledDateStatusFlag = styled.div<{ status: OfferDateStatus; disabled?: boolean }>`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  padding: 0 0.375rem;
  border-radius: 0.375rem;
  background: ${({ status, disabled }) =>
    disabled
      ? 'var(--grey-350)'
      : status === OfferDateStatus.scheduled
      ? 'var(--green-light)'
      : 'var(--error-light)'};
`;

interface DateStatusFlagProps {
  status: OfferDateStatus;
  disabled?: boolean;
  editable?: boolean;
}

export const DateStatusFlag: React.FC<DateStatusFlagProps> = ({
  status,
  disabled,
  editable = true,
}: DateStatusFlagProps) => {
  const t = useT();

  return (
    <StyledDateStatusFlag status={status} disabled={disabled}>
      {status ? t(OfferDateStatusToL10nMap(editable)[status]) : ''}
    </StyledDateStatusFlag>
  );
};
