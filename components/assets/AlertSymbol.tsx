import styled from '@emotion/styled';
import { ExclamationMarkSvg } from '../assets/ExclamationMarkSvg';

export const StyledAlertSymbol = styled.div`
  background: #f19203;
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

export const AlertSymbol: React.FC = () => (
  <StyledAlertSymbol>
    <ExclamationMarkSvg />
  </StyledAlertSymbol>
);
