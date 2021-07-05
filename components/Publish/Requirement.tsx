import styled from '@emotion/styled';
import { Check, X } from 'react-feather';

const StyledRequirement = styled.div<{ fulfilled: boolean }>`
  background: var(--grey-200);
  border: 1px solid ${({ fulfilled }) => (fulfilled ? 'var(--green-mid)' : 'var(--error)')};
  border-radius: 0.375rem;
  font-size: var(--font-size-200);
  line-height: var(--line-height-200);
  overflow: hidden;
  align-self: flex-start;

  display: flex;
  justify-content: space-between;
`;

const StyledRequirementText = styled.div`
  flex-grow: 1;
  padding: 0 0.375rem;
`;

const StyledRequirementMark = styled.div<{ fulfilled: boolean }>`
  flex-shrink: 0;
  flex-grow: 0;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ fulfilled }) => (fulfilled ? 'var(--green-light)' : 'var(--error-light)')};
  border-left: 1px solid ${({ fulfilled }) => (fulfilled ? 'var(--green-mid)' : 'var(--error)')};

  svg {
    padding: 0.25rem;
    width: 1rem;
    height: 1rem;
  }
`;

interface RequirementProps {
  text: string;
  fulfilled: boolean;
}

export const Requirement: React.FC<RequirementProps> = ({ text, fulfilled }: RequirementProps) => (
  <StyledRequirement fulfilled={fulfilled}>
    <StyledRequirementText>{text}</StyledRequirementText>
    <StyledRequirementMark fulfilled={fulfilled}>
      {fulfilled ? <Check color="var(--black)" /> : <X color="var(--black)" />}
    </StyledRequirementMark>
  </StyledRequirement>
);
