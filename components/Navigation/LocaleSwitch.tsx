import { ChangeEvent } from 'react';
import { Locale, locales } from '../../config/routes';
import { useLocale, useSwitchLocale } from '../../lib/routing';

export const LocaleSwitch: React.FC = () => {
  const activeLocale = useLocale();
  const switchLocale = useSwitchLocale();

  const select = (
    <select
      name="locale"
      value={activeLocale}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
        switchLocale(e.target.value as Locale);
      }}
    >
      {Object.entries(locales).map(([key, { name }], index) => (
        <option value={key} key={index}>
          {name}
        </option>
      ))}
    </select>
  );

  return (
    <>
      <br />
      {select}
    </>
  );
};
