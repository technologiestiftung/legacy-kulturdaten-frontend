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
import { Info, InfoColor } from '../../info';
import { Input, InputType } from '../../input';
import { useState } from 'react';
import { Button, ButtonColor, ButtonSize } from '../../button';
import { useLoadingScreen } from '../../Loading/LoadingScreen';

export const UserSettingsPage: React.FC = () => {
  const t = useT();
  const { user } = useUser();
  const uid = usePseudoUID();
  const loadingScreen = useLoadingScreen();

  const [dummyInput1, setDummyInput1] = useState('');
  const [dummyInput2, setDummyInput2] = useState('');

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
            <EntryFormHead title={t('settings.api.titleCreate') as string} />
            <FormGrid>
              <FormItem width={FormItemWidth.half}>
                <Input
                  type={InputType.text}
                  label={'Bezeichnung deiner Anwendung'}
                  value={dummyInput1}
                  placeholder={'Ein aussgaekräftiger Name'}
                  onChange={(e) => setDummyInput1(e.target.value)}
                />
              </FormItem>
              <FormItem width={FormItemWidth.half}>
                <Input
                  type={InputType.text}
                  label={'URL deiner Anwendung'}
                  value={dummyInput2}
                  placeholder={t('forms.urlPlaceholder') as string}
                  onChange={(e) => setDummyInput2(e.target.value)}
                />
              </FormItem>
              <FormItem width={FormItemWidth.full}>
                <Button
                  color={ButtonColor.black}
                  size={ButtonSize.big}
                  onClick={() =>
                    loadingScreen('Erstelle API Token', async () => {
                      setDummyInput1('');
                      setDummyInput2('');
                      return { success: true };
                    })
                  }
                >
                  API Token erstellen
                </Button>
              </FormItem>
              <FormItem width={FormItemWidth.full}>
                <Info color={InfoColor.white}>{t('settings.api.info')}</Info>
              </FormItem>
            </FormGrid>
          </EntryFormContainer>
          <EntryFormContainer>
            <EntryFormHead title={t('settings.api.titleList') as string} />
            <FormGrid>
              <FormItem width={FormItemWidth.full}>
                <div></div>
              </FormItem>
              <FormItem width={FormItemWidth.full}>
                <Info color={InfoColor.white}>{t('settings.api.info')}</Info>
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
