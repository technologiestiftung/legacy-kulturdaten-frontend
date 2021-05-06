import { ChangeEvent } from 'react';
import { Locale, locales } from '../../config/locales';
import { useT } from '../../lib/i18n';
import { useLocale, useSwitchLocale } from '../../lib/routing';
import { Select, SelectVariant } from '../select';

export const LocaleSwitch: React.FC = () => {
  const activeLocale = useLocale();
  const switchLocale = useSwitchLocale();
  const t = useT();

  const select = (
    <Select
      label={t('menu.localeSwitch.label') as string}
      ariaLabel={t('menu.localeSwitch.description') as string}
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

  return select;
};
