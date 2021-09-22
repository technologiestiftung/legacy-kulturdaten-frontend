import styled from '@emotion/styled';
import { useT } from '../../lib/i18n';
import { ExclamationMarkSvg } from '../assets/ExclamationMarkSvg';

export const StyledAlertSymbol = styled.div`
  background: var(--error);
  color: var(--white);
  border-radius: 0.375rem;
  line-height: 0;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;

interface AlertSymbolProps {
  ariaLabel?: string;
}

export const AlertSymbol: React.FC<AlertSymbolProps> = ({ ariaLabel }: AlertSymbolProps) => {
  const t = useT();

  return (
    <StyledAlertSymbol
      aria-label={
        typeof ariaLabel !== 'undefined' ? ariaLabel : (t('save.alertSymbolAriaLabel') as string)
      }
    >
      <ExclamationMarkSvg />
    </StyledAlertSymbol>
  );
};
