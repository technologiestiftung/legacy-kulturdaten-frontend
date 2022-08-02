import styled from '@emotion/styled';

export const StyledLabel = styled.label`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  color: inherit;
  display: inline-flex;
  flex-direction: row;
`;

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  ariaLabel?: string;
  id?: string;
}

export const Label: React.FC<LabelProps> = ({ children, htmlFor, ariaLabel, id }: LabelProps) => (
  <StyledLabel htmlFor={htmlFor} aria-label={ariaLabel} id={id}>{children}</StyledLabel>
);
