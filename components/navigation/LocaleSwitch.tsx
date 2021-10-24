import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ChangeEvent } from 'react';
import { Locale, locales } from '../../config/locales';
import { useT } from '../../lib/i18n';
import { useLocale, useSwitchLocale } from '../../lib/routing';
import { Select, SelectLabelPosition, SelectVariant } from '../select';
import { mq } from '../globals/Constants';
import { Breakpoint } from '../../lib/WindowService';

export enum LocaleSwitchVariant {
  default = 'default',
  minimal = 'minimal',
  settings = 'settings',
}

const StyledLocaleSwitch = styled.div<{ switchVariant: LocaleSwitchVariant }>`
  display: flex;

  ${({ switchVariant }) =>
    switchVariant === LocaleSwitchVariant.minimal
      ? css`
          padding: 0 0.75rem;
          -webkit-box-pack: end;
          justify-content: flex-end;
          label {
            display: none;
          }

          ${mq(Breakpoint.wide)} {
            padding: 0 1.5rem;
          }
        `
      : switchVariant === LocaleSwitchVariant.settings
      ? css``
      : css`
          padding: 1.5rem 1.5rem 2.25rem;
          -webkit-box-pack: start;
          justify-content: flex-start;
        `}
`;

export interface LocaleSwitchProps {
  switchVariant?: LocaleSwitchVariant;
  labelledBy?: string;
}

export const LocaleSwitch: React.FC<LocaleSwitchProps> = ({
  switchVariant = LocaleSwitchVariant.default,
  labelledBy,
}: LocaleSwitchProps) => {
  const activeLocale = useLocale();
  const switchLocale = useSwitchLocale();
  const t = useT();

  const select = (
    <Select
      label={labelledBy ? undefined : (t('menu.localeSwitch.label') as string)}
      labelPosition={SelectLabelPosition.left}
      ariaLabel={t('menu.localeSwitch.description') as string}
      ariaLabelledby={labelledBy}
      variant={SelectVariant.minimal}
      id="locale"
      value={activeLocale}
      icon="Globe"
      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
        switchLocale(e.target.value as Locale);
      }}
    >
      {Object.entries(locales).map(([key, { name }], index) => (
        <option value={key} key={index}>
          {name}
        </option>
      ))}
    </Select>
  );

  return (
    <StyledLocaleSwitch switchVariant={switchVariant as LocaleSwitchVariant}>
      {select}
    </StyledLocaleSwitch>
  );
};
