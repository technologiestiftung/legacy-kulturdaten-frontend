import styled from '@emotion/styled';
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

export const InfoSymbol: React.FC = () => (
  <StyledInfoSymbol>
    <InfoISvg />
  </StyledInfoSymbol>
);
