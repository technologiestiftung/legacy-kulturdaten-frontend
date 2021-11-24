import { useContext } from 'react';
import { Routes, routes } from '../../../config/routes';
import { useT } from '../../../lib/i18n';
import { useActiveRoute, useLocale } from '../../../lib/routing';
import { EntryHeader } from '../../EntryHeader';
import { Tabs } from '../../navigation/tabs';
import { UserContext } from '../../user/UserContext';
import { useUser } from '../../user/useUser';

export const SettingsHeader: React.FC = () => {
  const { user } = useUser();
  const t = useT();
  const locale = useLocale();
  const activeRoute = useActiveRoute();
  const { userInactive } = useContext(UserContext);

  return (
    <EntryHeader
      title={t('settings.title') as string}
      subTitle={user?.attributes.email}
      tabs={
        <Tabs
          links={[
            {
              title: 'Persönliche Einstellungen',
              href: routes.userSettings({ locale }),
              isActive: activeRoute === Routes.userSettings,
            },
            {
              title: 'Entwickler:innen-Einstellungen',
              href: routes.developer({ locale }),
              isActive: activeRoute === Routes.developer,
              disabled: userInactive,
            },
          ]}
        />
      }
    />
  );
};
