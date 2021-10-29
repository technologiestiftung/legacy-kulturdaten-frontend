import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Check } from 'react-feather';

const StyledRequirement = styled.div<{ fulfilled: boolean }>`
  background: ${({ fulfilled }) => (fulfilled ? 'var(--white-o50)' : 'var(--white)')};
  color: ${({ fulfilled }) => (fulfilled ? 'var(--black-o70)' : 'var(--black)')};
  border-radius: 0.1875rem;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  display: flex;
  justify-content: flex-start;
  column-gap: 0.1875rem;
  padding: 0.1875rem 0.5625rem 0.1875rem 0.1875rem;
`;

const StyledRequirementText = styled.div`
  flex-grow: 1;
`;

const StyledRequirementMark = styled.div<{ fulfilled: boolean }>`
  flex-shrink: 0;
  flex-grow: 0;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    padding: 0.1875rem;
    width: 1.125rem;
    height: 1.125rem;
  }

  ${({ fulfilled }) =>
    !fulfilled
      ? css`
          &::after {
            content: '';
            position: relative;
            background: var(--red-publish);
            width: 0.625rem;
            height: 0.625rem;
            border-radius: 1rem;
            border: 0.4375rem solid var(--white);
          }
        `
      : 'opacity: 0.7;'}
`;

interface RequirementProps {
  text: string;
  fulfilled: boolean;
}

export const Requirement: React.FC<RequirementProps> = ({ text, fulfilled }: RequirementProps) => (
  <StyledRequirement fulfilled={fulfilled}>
    <StyledRequirementMark fulfilled={fulfilled}>
      {fulfilled && <Check color="var(--green-publish)" />}
    </StyledRequirementMark>
    <StyledRequirementText>{text}</StyledRequirementText>
  </StyledRequirement>
);
