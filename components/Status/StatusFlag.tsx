import styled from '@emotion/styled';
import { PublishedStatus } from '../../lib/api/types/general';
import { useT } from '../../lib/i18n';

const StyledStatusFlag = styled.div<{ status: PublishedStatus }>`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);

  span {
    padding: 0 0.375rem;
    border: 1px solid rgba(0, 0, 0, 0.25);
    border-radius: 0.375rem;
    background: ${({ status }) =>
      status === PublishedStatus.draft ? 'var(--mustard)' : 'var(--green-light)'};
  }
`;

interface StatusFlagProps {
  status: PublishedStatus;
}

export const StatusFlag: React.FC<StatusFlagProps> = ({ status }: StatusFlagProps) => {
  const t = useT();

  return (
    <StyledStatusFlag status={status}>
      <span>{t(`statusBar.${status}`)}</span>
    </StyledStatusFlag>
  );
};
