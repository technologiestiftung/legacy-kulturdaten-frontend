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
import { useContext, useState } from 'react';
import { Button, ButtonColor, ButtonSize } from '../../button';
import { useLoadingScreen } from '../../Loading/LoadingScreen';
import {
  StyledTeamList,
  StyledTeamListItem,
  StyledTeamListItemText,
  StyledTeamListItemTextBold,
  StyledTeamListItemTitle,
  StyledTeamListList,
  StyledTeamListListTitleRow,
} from '../../Team/TeamList';
import styled from '@emotion/styled';
import { mq } from '../../globals/Constants';
import { Breakpoint, useBreakpointOrWider } from '../../../lib/WindowService';
import { Textarea } from '../../textarea';
import { UserContext } from '../../user/UserContext';
import { Tabs } from '../../navigation/tabs';
import { routes } from '../../../config/routes';
import { useLocale } from '../../../lib/routing';

const CustomListTitleRow = styled(StyledTeamListListTitleRow)`
  grid-template-columns: 100%;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: calc(50% - 2.625rem) 20% 20% 10%;
  }
`;

const CustomListItem = styled(StyledTeamListItem)`
  grid-template-columns: 100%;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: calc(50% - 2.625rem) 20% 20% 10%;
  }
`;

export const UserSettingsPage: React.FC = () => {
  const t = useT();
  const { user } = useUser();
  const uid = usePseudoUID();
  const loadingScreen = useLoadingScreen();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const { acceptedTerms } = useContext(UserContext);
  const locale = useLocale();

  const [dummyInput1, setDummyInput1] = useState('');
  const [dummyInput2, setDummyInput2] = useState('');
  const [dummyInput3, setDummyInput3] = useState('');

  return (
    <>
      <EntryHeader
        title={t('settings.title') as string}
        subTitle={user?.attributes.email}
        minimalVariant
        tabs={
          <Tabs
            links={[
              {
                title: 'Persönlich',
                href: routes.userSettings({ locale }),
              },
            ]}
          />
        }
      />
      <div>
        <EntryFormWrapper>
          {!acceptedTerms && (
            <EntryFormContainer>
              <EntryFormHead title="TERMS" />
              <FormGrid></FormGrid>
            </EntryFormContainer>
          )}
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
              title={t('settings.api.titleCreate') as string}
              tooltip={t('settings.api.titleCreateTooltip')}
            />
            <FormGrid>
              <FormItem width={FormItemWidth.half}>
                <Input
                  type={InputType.text}
                  label={t('settings.api.projectTitle') as string}
                  value={dummyInput1}
                  placeholder={t('settings.api.projectTitlePlaceholder') as string}
                  onChange={(e) => setDummyInput1(e.target.value)}
                />
              </FormItem>
              <FormItem width={FormItemWidth.half}>
                <Input
                  type={InputType.text}
                  label={`${t('settings.api.projectUrl')} (${t('forms.optional')})`}
                  value={dummyInput2}
                  placeholder={t('forms.urlPlaceholder') as string}
                  onChange={(e) => setDummyInput2(e.target.value)}
                />
              </FormItem>
              <FormItem width={FormItemWidth.half}>
                <Textarea
                  id={'project-description'}
                  value={dummyInput3}
                  label={`${t('settings.api.projectDescription')} (${t('forms.optional')})`}
                  placeholder={t('settings.api.projectDescriptionPlaceholder') as string}
                  onChange={(e) => setDummyInput3(e.target.value)}
                />
              </FormItem>
              <FormItem width={FormItemWidth.full}>
                <Button
                  color={ButtonColor.black}
                  size={ButtonSize.big}
                  onClick={() =>
                    loadingScreen(t('settings.loading'), async () => {
                      setDummyInput1('');
                      setDummyInput2('');
                      setDummyInput3('');
                      return { success: true };
                    })
                  }
                >
                  {t('settings.api.createButton') as string}
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
                <StyledTeamList>
                  <StyledTeamListList>
                    {isMidOrWider && (
                      <CustomListTitleRow>
                        <StyledTeamListItemTitle>
                          {t('settings.api.tokenTitle') as string}
                        </StyledTeamListItemTitle>
                        <StyledTeamListItemTitle>
                          {t('settings.api.tokenName') as string}
                        </StyledTeamListItemTitle>
                        <StyledTeamListItemTitle>
                          {t('settings.api.tokenUrl') as string}
                        </StyledTeamListItemTitle>
                      </CustomListTitleRow>
                    )}
                    <CustomListItem>
                      {!isMidOrWider && (
                        <StyledTeamListItemTextBold>
                          {t('settings.api.tokenTitle') as string}
                        </StyledTeamListItemTextBold>
                      )}
                      <StyledTeamListItemText>
                        UDK8rdbeF7cJ63SST6hSXDbEp4KgEqSY
                      </StyledTeamListItemText>
                      {!isMidOrWider && (
                        <StyledTeamListItemTextBold>
                          {t('settings.api.tokenName') as string}
                        </StyledTeamListItemTextBold>
                      )}
                      <StyledTeamListItemText>BDE Mobile App</StyledTeamListItemText>
                      {!isMidOrWider && (
                        <StyledTeamListItemTextBold>
                          {t('settings.api.tokenUrl') as string}
                        </StyledTeamListItemTextBold>
                      )}
                      <StyledTeamListItemText>bde.mobile</StyledTeamListItemText>
                      <StyledTeamListItemText>
                        <Button color={ButtonColor.black}>{t('general.remove') as string}</Button>
                      </StyledTeamListItemText>
                    </CustomListItem>
                    <CustomListItem>
                      {!isMidOrWider && (
                        <StyledTeamListItemTextBold>
                          {t('settings.api.tokenTitle') as string}
                        </StyledTeamListItemTextBold>
                      )}
                      <StyledTeamListItemText>
                        zfEY3M2ekAyABs53s34tJ9XUeK6hEtnF
                      </StyledTeamListItemText>
                      {!isMidOrWider && (
                        <StyledTeamListItemTextBold>
                          {t('settings.api.tokenName') as string}
                        </StyledTeamListItemTextBold>
                      )}
                      <StyledTeamListItemText>BDE Web App</StyledTeamListItemText>
                      {!isMidOrWider && (
                        <StyledTeamListItemTextBold>
                          {t('settings.api.tokenUrl') as string}
                        </StyledTeamListItemTextBold>
                      )}
                      <StyledTeamListItemText>bde.com</StyledTeamListItemText>
                      <StyledTeamListItemText>
                        <Button color={ButtonColor.black}>{t('general.remove') as string}</Button>
                      </StyledTeamListItemText>
                    </CustomListItem>
                    <CustomListItem>
                      {!isMidOrWider && (
                        <StyledTeamListItemTextBold>
                          {t('settings.api.tokenTitle') as string}
                        </StyledTeamListItemTextBold>
                      )}
                      <StyledTeamListItemText>
                        hFnexC5g72bPYSBp3UKgDv6c7xWBCtg9
                      </StyledTeamListItemText>
                      {!isMidOrWider && (
                        <StyledTeamListItemTextBold>
                          {t('settings.api.tokenName') as string}
                        </StyledTeamListItemTextBold>
                      )}
                      <StyledTeamListItemText>Test Token</StyledTeamListItemText>
                      {!isMidOrWider && (
                        <StyledTeamListItemTextBold>
                          {t('settings.api.tokenUrl') as string}
                        </StyledTeamListItemTextBold>
                      )}
                      <StyledTeamListItemText>example.com</StyledTeamListItemText>
                      <StyledTeamListItemText>
                        <Button color={ButtonColor.black}>{t('general.remove') as string}</Button>
                      </StyledTeamListItemText>
                    </CustomListItem>
                  </StyledTeamListList>
                </StyledTeamList>
              </FormItem>
            </FormGrid>
          </EntryFormContainer>
          <EntryFormContainer>
            <EntryFormHead title={t('settings.docs.title') as string} />
            <FormGrid>
              <FormItem width={FormItemWidth.full}>
                <DashboardLinkList
                  links={[
                    {
                      type: StandardLinkType.external,
                      title: t('settings.docs.api') as string,
                      href: 'https://beta.api.kulturdaten-berlin.anyvent.cloud/docs/',
                    },
                    {
                      type: StandardLinkType.external,
                      title: t('settings.docs.frontend') as string,
                      href: 'https://github.com/technologiestiftung/kulturdaten-frontend',
                    },
                    {
                      type: StandardLinkType.external,
                      title: t('settings.docs.backend') as string,
                      href: 'https://github.com/technologiestiftung/kulturdaten-api',
                    },
                  ]}
                />
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
        </EntryFormWrapper>
      </div>
    </>
  );
};
