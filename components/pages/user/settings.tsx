import { StyledEntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useT } from '../../../lib/i18n';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { LocaleSwitch, LocaleSwitchVariant } from '../../navigation/LocaleSwitch';
import { usePseudoUID } from '../../../lib/uid';
import { DashboardLinkList } from '../../Dasboard/DashboardLinkList';
import { StandardLinkType } from '../../../lib/generalTypes';
import { useContext } from 'react';
import { UserContext } from '../../user/UserContext';
import { SettingsHeader } from './SettingsHeader';
import { UserPasswordUpdate } from '../../Settings/PasswordUpdate';
import { Terms } from '../../Settings/Terms';
import { DeleteUser } from '../../Settings/DeleteUser';

export const UserSettingsPage: React.FC = () => {
  const t = useT();
  const uid = usePseudoUID();
  const { acceptedTerms } = useContext(UserContext);

  return (
    <>
      <SettingsHeader />
      <div>
        <EntryFormWrapper>
          {!acceptedTerms && <Terms />}
          <UserPasswordUpdate />
          <StyledEntryFormContainer>
            <EntryFormHead
              title={t('menu.localeSwitch.label') as string}
              id={`${uid}-localeswitch`}
            />
            <FormGrid>
              <FormItem width={FormItemWidth.full}>
                <LocaleSwitch
                  switchVariant={LocaleSwitchVariant.settings}
                  labelledBy={`${uid}-localeswitch`}
                />
              </FormItem>
            </FormGrid>
          </StyledEntryFormContainer>
          <StyledEntryFormContainer>
            <EntryFormHead title={t('settings.legal.title') as string} />
            <FormGrid>
              <FormItem width={FormItemWidth.full}>
                <DashboardLinkList
                  links={[
                    {
                      type: StandardLinkType.external,
                      title: t('settings.legal.legalNotice') as string,
                      href: 'https://kulturdaten.berlin/impressum/',
                    },
                    {
                      type: StandardLinkType.external,
                      title: t('settings.legal.terms') as string,
                      href: ' https://kulturdaten.berlin/agb/',
                    },
                    {
                      type: StandardLinkType.external,
                      title: t('settings.legal.mediaLicense') as string,
                      href: 'https://kulturdaten.berlin/daten-bereitstellen/#lizenz',
                    },
                  ]}
                />
              </FormItem>
            </FormGrid>
          </StyledEntryFormContainer>
          <DeleteUser />
        </EntryFormWrapper>
      </div>
    </>
  );
};
