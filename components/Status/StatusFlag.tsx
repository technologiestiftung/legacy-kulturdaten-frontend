import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { PublishedStatus } from '../../lib/api/types/general';
import { useT } from '../../lib/i18n';

const StyledStatusFlag = styled.div<{ status: PublishedStatus; variant: StatusFlagVariant }>`
  display: flex;
`;

const StyledEntryHeaderStatusLabel = styled.div`
  padding: calc(0.375rem) calc(0.75rem);
  text-align: center;

  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
  border-radius: 0.375rem 0 0 0.375rem;
  background: var(--white);
`;

const StyledEntryHeaderStatusFlag = styled.span<{
  status: PublishedStatus;
  variant: StatusFlagVariant;
}>`
  padding: 0 0.375rem;
  border-radius: 0.375rem;
  background: ${({ status }) =>
    status === PublishedStatus.draft ? 'var(--yellow)' : 'var(--green-light)'};
  color: rgba(0, 0, 0, 0.8);
  font-weight: 700;

  font-size: var(--font-size-200);
  line-height: var(--line-height-200);

  ${({ variant }) =>
    variant === StatusFlagVariant.big &&
    css`
      border-radius: 0 0.375rem 0.375rem 0;
      padding: 0.375rem 0.75rem;
      font-size: var(--font-size-400);
      line-height: var(--line-height-400);
    `}
`;

export enum StatusFlagVariant {
  small = 'small',
  big = 'big',
}

interface StatusFlagProps {
  status: PublishedStatus;
  variant?: StatusFlagVariant;
}

export const StatusFlag: React.FC<StatusFlagProps> = ({
  status,
  variant = StatusFlagVariant.small,
}: StatusFlagProps) => {
  const t = useT();

  return (
    <StyledStatusFlag status={status} variant={variant}>
      {variant === StatusFlagVariant.big && (
        <StyledEntryHeaderStatusLabel>{t('statusBar.status')}</StyledEntryHeaderStatusLabel>
      )}
      <StyledEntryHeaderStatusFlag status={status} variant={variant}>
        {t(`statusBar.${status}`)}
      </StyledEntryHeaderStatusFlag>
    </StyledStatusFlag>
  );
};
