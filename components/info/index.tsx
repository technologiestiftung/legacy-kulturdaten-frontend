import styled from '@emotion/styled';
import { Info as InfoIcon } from 'react-feather';
import { insetBorderColored } from '../globals/Constants';

const StyledInfo = styled.div`
  border-radius: 0.75rem;
  background: var(--yellow);
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  padding: 0.75rem;
  display: flex;
  box-shadow: ${insetBorderColored('var(--yellow-dark)', true)};
`;

const StyledInfoIcon = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  margin-right: 0.75rem;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const StyledInfoText = styled.div`
  max-width: 64ch;
`;

interface InfoProps {
  children: React.ReactNode;
}

export const Info: React.FC<InfoProps> = ({ children }: InfoProps) => (
  <StyledInfo>
    <StyledInfoIcon>
      <InfoIcon color="var(--black)" />
    </StyledInfoIcon>
    <StyledInfoText>{children}</StyledInfoText>
  </StyledInfo>
);
