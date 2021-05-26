import styled from '@emotion/styled';
import { CheckboxProps } from '.';
import { Label } from '../label';

const StyledCheckboxList = styled.div``;

const StyedCheckboxListLabel = styled.div`
  margin-bottom: 0.75rem;
`;

const StyledCheckboxListItems = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-row-gap: 0.75rem;
`;

interface CheckboxListProps {
  children: React.ReactElement<CheckboxProps> | React.ReactElement<CheckboxProps>[];
  label: string;
}

export const CheckboxList: React.FC<CheckboxListProps> = ({
  label,
  children,
}: CheckboxListProps) => (
  <StyledCheckboxList>
    <StyedCheckboxListLabel>
      <Label>{label}</Label>
    </StyedCheckboxListLabel>
    <StyledCheckboxListItems>{children}</StyledCheckboxListItems>
  </StyledCheckboxList>
);
