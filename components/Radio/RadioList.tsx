import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Radio } from '.';
import { ComponentVariant, ComponentVariants, ComponentWithVariants } from '../../lib/generalTypes';
import { useT } from '../../lib/i18n';
import { mq, focusStyles } from '../globals/Constants';
import { Breakpoint } from '../../lib/WindowService';
import { ExternalLink } from 'react-feather';

const StyledRadioList = styled.div<{ variant?: ComponentVariant }>`
  ${({ variant }) =>
    variant === ComponentVariants.formList &&
    css`
      padding: 0.75rem;

      ${mq(Breakpoint.mid)} {
        padding: 0.75rem 1.125rem;
      }
    `}
`;

const StyedRadioListLabel = styled.legend`
  margin-bottom: 0.75rem;
  font-weight: 700;
  font-size: var(--font-size-300);
`;

const StyledRadioListItems = styled.ul`
  display: grid;
  grid-template-columns: auto;
  grid-row-gap: 0.75rem;
`;

const StyledRadioListItem = styled.li`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledRadioListItemLinkA = styled.a`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  padding: 0 0 0 0.75rem;
  flex-shrink: 0;
  color: inherit;
  overflow-wrap: anywhere;
  word-break: break-word;
  display: inline-flex;
  align-items: center;

  ${focusStyles}

  svg {
    padding: 0.1875rem 0;
    width: 1.125rem;
    height: 1.125rem;
  }
`;

export interface RadioListProps extends ComponentWithVariants {
  options: {
    label: string;
    value: string;
    id?: string;
    link?: {
      href: string;
      title: string;
    };
  }[];
  name: string;
  id: string;
  label?: string;
  ariaLabel?: string;
  required?: boolean;
  softRequired?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export const RadioList: React.FC<RadioListProps> = ({
  options,
  name,
  id,
  label,
  ariaLabel,
  value,
  onChange,
  required,
  softRequired,
  variant,
}: RadioListProps) => {
  const t = useT();

  return (
    <StyledRadioList variant={variant}>
      <fieldset tabIndex={0}>
        {label && (
          <StyedRadioListLabel>
            {label} {required ? ` ${t('forms.required')}` : ''}
          </StyedRadioListLabel>
        )}
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
                softRequired={softRequired}
                valid={Boolean(
                  !required || !softRequired || (value?.length > 0 && value !== 'undefined')
                )}
              />
              {option.link && (
                <StyledRadioListItemLinkA
                  href={option.link.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  title={option.link.title}
                  aria-label={option.link.title}
                >
                  <ExternalLink aria-hidden />
                </StyledRadioListItemLinkA>
              )}
            </StyledRadioListItem>
          ))}
        </StyledRadioListItems>
      </fieldset>
    </StyledRadioList>
  );
};
