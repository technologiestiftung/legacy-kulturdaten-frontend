import styled from '@emotion/styled';
import { Radio } from '.';

const StyledRadioList = styled.div``;

const StyledRadioListItems = styled.ul`
  display: grid;
  grid-template-columns: auto;
  grid-row-gap: 0.75rem;
`;

const StyledRadioListItem = styled.li``;

export interface RadioListProps {
  options: {
    label: string;
    value: string;
    id?: string;
  }[];
  name: string;
  id?: string;
  ariaLabel?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export const RadioList: React.FC<RadioListProps> = ({
  options,
  name,
  id,
  ariaLabel,
  value,
  onChange,
  required,
}: RadioListProps) => {
  return (
    <StyledRadioList>
      <StyledRadioListItems aria-label={ariaLabel}>
        {options?.map((option, index) => (
          <StyledRadioListItem key={index}>
            <Radio
              name={name}
              id={option.id || `${id}-${index}`}
              label={option.label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              required={required}
            />
          </StyledRadioListItem>
        ))}
      </StyledRadioListItems>
    </StyledRadioList>
  );
};
