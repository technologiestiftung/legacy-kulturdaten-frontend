import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useT } from '../../../lib/i18n';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { LocaleSwitch, LocaleSwitchVariant } from '../../navigation/LocaleSwitch';
import { usePseudoUID } from '../../../lib/uid';
import { DashboardLinkList } from '../../Dasboard/DashboardLinkList';
import { StandardLinkType } from '../../../lib/generalTypes';
import { Input, InputType } from '../../input';
import { useContext, useState } from 'react';
import { Button, ButtonColor, ButtonSize } from '../../button';
import { UserContext } from '../../user/UserContext';
import {
  DashboardTile,
  DashboardTileText,
  DashboardTileTextP,
  DashboardTileVariant,
} from '../../Dasboard/DashboardTile';
import { Checkbox } from '../../checkbox';
import { SettingsHeader } from './SettingsHeader';
import { useConfirmScreen } from '../../Confirm/ConfirmScreen';
import { useUser } from '../../user/useUser';

const TermsComponent: React.FC = () => {
  const [accepted, setAccepted] = useState(false);
  const uid = usePseudoUID();
  const t = useT();

  return (
    <EntryFormContainer>
      <FormGrid>
        <DashboardTile
          title={t('settings.terms.title') as string}
          variant={DashboardTileVariant.hint}
        >
          <DashboardTileText>
            <DashboardTileTextP>{t('settings.terms.text')}</DashboardTileTextP>
            <FormGrid>
              <FormItem width={FormItemWidth.full}>
                <Checkbox
                  id={`${uid}-terms`}
                  label={t('register.confirmationText')}
                  required
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
              </FormItem>
              <FormItem width={FormItemWidth.full}>
                <Button size={ButtonSize.big} color={ButtonColor.black} disabled={!accepted}>
                  {t('settings.terms.button')}
                </Button>
              </FormItem>
            </FormGrid>
          </DashboardTileText>
        </DashboardTile>
      </FormGrid>
    </EntryFormContainer>
  );
};

export const UserSettingsPage: React.FC = () => {
  const t = useT();
  const uid = usePseudoUID();
  const { user } = useUser();
  const { acceptedTerms } = useContext(UserContext);
  const confirmScreen = useConfirmScreen();

  return (
    <>
      <SettingsHeader />
      <div>
        <EntryFormWrapper>
          {!acceptedTerms && <TermsComponent />}
          <EntryFormContainer>
            <EntryFormHead
              title={`${t('settings.personal.title')} (${t('forms.optional')})`}
              tooltip={t('settings.personal.tooltip')}
            />
            <FormGrid>
              <FormItem width={FormItemWidth.half}>
                <Input type={InputType.text} label={t('settings.personal.firstname') as string} />
              </FormItem>
              <FormItem width={FormItemWidth.half}>
                <Input type={InputType.text} label={t('settings.personal.lastname') as string} />
              </FormItem>
              <FormItem width={FormItemWidth.full}>
                <Button color={ButtonColor.black} size={ButtonSize.big}>
                  {t('forms.save') as string}
                </Button>
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
          </EntryFormContainer>
          <EntryFormContainer>
            <EntryFormHead title={t('settings.legal.title') as string} />
            <FormGrid>
              <FormItem width={FormItemWidth.full}>{t('settings.deletion.text')}</FormItem>
              <FormItem width={FormItemWidth.full}>
                <Button
                  size={ButtonSize.big}
                  onClick={() =>
                    confirmScreen({
                      title: 'test',
                      message: 'Really?',
                      confirmText: 'Confirm',
                      onConfirm: async () => await console.log('click'),
                      condition: {
                        label: 'E-Mail',
                        value: user?.attributes?.email,
                      },
                    })
                  }
                >
                  {t('settings.deletion.button')}
                </Button>
              </FormItem>
            </FormGrid>
          </EntryFormContainer>
        </EntryFormWrapper>
      </div>
    </>
  );
};
