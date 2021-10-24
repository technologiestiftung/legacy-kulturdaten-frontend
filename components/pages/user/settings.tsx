import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useT } from '../../../lib/i18n';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { useUser } from '../../user/useUser';
import { EntryHeader } from '../../EntryHeader';
import { LocaleSwitch, LocaleSwitchVariant } from '../../navigation/LocaleSwitch';
import { usePseudoUID } from '../../../lib/uid';
import { DashboardLinkList } from '../../Dasboard/DashboardLinkList';
import { StandardLinkType } from '../../../lib/generalTypes';

export const UserSettingsPage: React.FC = () => {
  const t = useT();
  const { user } = useUser();
  const uid = usePseudoUID();

  return (
    <>
      <EntryHeader
        title={'Einstellungen'}
        subTitle={user?.attributes.email}
        minimalVariant
        status={undefined}
      />
      <div>
        <EntryFormWrapper>
          <EntryFormContainer>
            <EntryFormHead title="API Token " />
            <FormGrid>
              <FormItem width={FormItemWidth.full}>
                <div>stuff</div>
              </FormItem>
            </FormGrid>
          </EntryFormContainer>
          <EntryFormContainer>
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
          </EntryFormContainer>
          <EntryFormContainer>
            <EntryFormHead title={t('settings.legal.title') as string} />
            <FormGrid>
              <FormItem width={FormItemWidth.full}>
                <DashboardLinkList
                  links={[
                    {
                      type: StandardLinkType.external,
                      title: t('settings.legal.legalNotice') as string,
                      href: 'https://kulturdaten.berlin',
                    },
                    {
                      type: StandardLinkType.external,
                      title: t('settings.legal.terms') as string,
                      href: 'https://kulturdaten.berlin',
                    },
                    {
                      type: StandardLinkType.external,
                      title: t('settings.legal.mediaLicense') as string,
                      href: 'https://kulturdaten.berlin',
                    },
                  ]}
                />
              </FormItem>
            </FormGrid>
          </EntryFormContainer>
        </EntryFormWrapper>
      </div>
    </>
  );
};
