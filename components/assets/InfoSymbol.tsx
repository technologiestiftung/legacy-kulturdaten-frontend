import styled from '@emotion/styled';
import { useT } from '../../lib/i18n';
import { InfoISvg } from '../assets/InfoISvg';

export const StyledInfoSymbol = styled.div`
  background: rgb(10, 47, 211);
  color: var(--white);
  border-radius: 0.375rem;
  line-height: 0;
  width: 1.5rem;
  height: 1.5rem;

  svg {
    width: 100%;
    height: 100%;
  }
`;

interface InfoSymbolProps {
  ariaLabel?: string;
}

export const InfoSymbol: React.FC<InfoSymbolProps> = ({ ariaLabel }: InfoSymbolProps) => {
  const t = useT();

  return (
    <StyledInfoSymbol
      aria-label={
        typeof ariaLabel !== 'undefined' ? ariaLabel : (t('save.infoSymbolAriaLabel') as string)
      }
    >
      <InfoISvg />
    </StyledInfoSymbol>
  );
};
