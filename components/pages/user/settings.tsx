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
import {
  StyledTeamList,
  StyledTeamListItem,
  StyledTeamListItemText,
  StyledTeamListItemTitle,
  StyledTeamListList,
  StyledTeamListListTitleRow,
} from '../../Team/TeamList';
import styled from '@emotion/styled';
import { mq } from '../../globals/Constants';
import { Breakpoint, useBreakpointOrWider } from '../../../lib/WindowService';

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
                <StyledTeamList>
                  <StyledTeamListList>
                    {isMidOrWider && (
                      <CustomListTitleRow>
                        <StyledTeamListItemTitle>Token</StyledTeamListItemTitle>
                        <StyledTeamListItemTitle>Bezeichnung</StyledTeamListItemTitle>
                        <StyledTeamListItemTitle>URL</StyledTeamListItemTitle>
                      </CustomListTitleRow>
                    )}
                    <CustomListItem>
                      <StyledTeamListItemText>
                        UDK8rdbeF7cJ63SST6hSXDbEp4KgEqSY
                      </StyledTeamListItemText>
                      <StyledTeamListItemText>BDE Mobile App</StyledTeamListItemText>
                      <StyledTeamListItemText>bde.mobile</StyledTeamListItemText>
                      <StyledTeamListItemText>
                        <Button color={ButtonColor.black}>entfernen</Button>
                      </StyledTeamListItemText>
                    </CustomListItem>
                    <CustomListItem>
                      <StyledTeamListItemText>
                        zfEY3M2ekAyABs53s34tJ9XUeK6hEtnF
                      </StyledTeamListItemText>
                      <StyledTeamListItemText>BDE Web App</StyledTeamListItemText>
                      <StyledTeamListItemText>bde.com</StyledTeamListItemText>
                      <StyledTeamListItemText>
                        <Button color={ButtonColor.black}>entfernen</Button>
                      </StyledTeamListItemText>
                    </CustomListItem>
                    <CustomListItem>
                      <StyledTeamListItemText>
                        hFnexC5g72bPYSBp3UKgDv6c7xWBCtg9
                      </StyledTeamListItemText>
                      <StyledTeamListItemText>Test Token</StyledTeamListItemText>
                      <StyledTeamListItemText>example.com</StyledTeamListItemText>
                      <StyledTeamListItemText>
                        <Button color={ButtonColor.black}>entfernen</Button>
                      </StyledTeamListItemText>
                    </CustomListItem>
                  </StyledTeamListList>
                </StyledTeamList>
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
