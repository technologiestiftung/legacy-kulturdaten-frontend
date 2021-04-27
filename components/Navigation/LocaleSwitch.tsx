import { useRouter } from 'next/router';
import { ChangeEvent } from 'react';
import { Locale, locales, routes } from '../../config/routes';
import { useActiveRoute, useLocale } from '../../lib/routing';

export const LocaleSwitch: React.FC = () => {
  const activeLocale = useLocale();
  const activeRoute = useActiveRoute();
  const router = useRouter();

  const select = (
    <select
      name="language"
      value={activeLocale}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
        router.push(
          routes[activeRoute]({ locale: e.target.value as Locale, query: router.query }),
          null,
          { locale: e.target.value }
        );
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
