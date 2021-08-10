import styled from '@emotion/styled';
import { PublishedStatus } from '../../lib/api/types/general';
import { useT } from '../../lib/i18n';

const StyledStatusFlag = styled.div<{ status: PublishedStatus }>`
  font-size: var(--font-size-200);
  line-height: var(--line-height-200);

  span {
    padding: 0.1875rem 0.375rem;
    /* border: 1px solid rgba(0, 0, 0, 0.25); */
    border-radius: 0.375rem;
    /* background: var(--grey-200); */
    background: ${({ status }) =>
      status === PublishedStatus.draft ? 'var(--yellow)' : 'var(--green-light)'};
    color: rgba(0, 0, 0, 0.8);
    font-weight: 700;
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
