import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useT } from '../../../lib/i18n';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { DashboardLinkList } from '../../Dasboard/DashboardLinkList';
import { StandardLinkType } from '../../../lib/generalTypes';
import { Info, InfoColor } from '../../info';
import { Input, InputType } from '../../input';
import { useMemo, useState } from 'react';
import { Button, ButtonColor, ButtonSize, ButtonType } from '../../button';
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
import { SettingsHeader } from './SettingsHeader';
import { useApiCall } from '../../../lib/api';
import { AppTokenCreate, appTokenCreateFactory } from '../../../lib/api/routes/appToken/create';
import { useAppTokenList } from '../../../lib/appTokenList';

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

export const UserDeveloperPage: React.FC = () => {
  const t = useT();
  const loadingScreen = useLoadingScreen();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  const { appTokens, mutate } = useAppTokenList();

  const tokenNameValid = useMemo(() => {
    if (name?.length === 0 || appTokens?.find((token) => token.name.trim() === name.trim())) {
      return false;
    }

    return true;
  }, [appTokens, name]);

  const call = useApiCall();

  return (
    <>
      <SettingsHeader />
      <div>
        <EntryFormWrapper>
          <EntryFormContainer>
            <EntryFormHead
              title={t('settings.api.titleCreate') as string}
              tooltip={t('settings.api.titleCreateTooltip')}
            />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (tokenNameValid) {
                  loadingScreen(t('settings.loading'), async () => {
                    try {
                      const resp = await call<AppTokenCreate>(appTokenCreateFactory, {
                        appToken: {
                          attributes: {
                            name,
                            description,
                          },
                        },
                      });

                      if (resp.status === 200) {
                        mutate();
                        return { success: true };
                      }
                    } catch (e) {
                      console.error(e);

                      return { success: false, error: t('general.serverProblem') };
                    }
                  });
                }
              }}
            >
              <FormGrid>
                <FormItem width={FormItemWidth.half}>
                  <Input
                    type={InputType.text}
                    label={t('settings.api.projectTitle') as string}
                    value={name}
                    placeholder={t('settings.api.projectTitlePlaceholder') as string}
                    onChange={(e) => setName(e.target.value)}
                    required
                    valid={tokenNameValid}
                    error={
                      !tokenNameValid ? (t('settings.api.uniqueNameError') as string) : undefined
                    }
                  />
                </FormItem>
                <FormItem width={FormItemWidth.half}>
                  <Input
                    type={InputType.text}
                    label={`${t('settings.api.projectUrl')} (${t('forms.optional')})`}
                    value={url}
                    placeholder={t('forms.urlPlaceholder') as string}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </FormItem>
                <FormItem width={FormItemWidth.half}>
                  <Textarea
                    id={'project-description'}
                    label={`${t('settings.api.projectDescription')} (${t('forms.optional')})`}
                    placeholder={t('settings.api.projectDescriptionPlaceholder') as string}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={100}
                  />
                </FormItem>
                <FormItem width={FormItemWidth.full}>
                  <Button
                    color={ButtonColor.black}
                    size={ButtonSize.big}
                    type={ButtonType.submit}
                    disabled={!tokenNameValid}
                  >
                    {t('settings.api.createButton') as string}
                  </Button>
                </FormItem>
                <FormItem width={FormItemWidth.full}>
                  <Info color={InfoColor.white}>{t('settings.api.info')}</Info>
                </FormItem>
              </FormGrid>
            </form>
          </EntryFormContainer>
          <EntryFormContainer>{JSON.stringify(appTokens)}</EntryFormContainer>
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
        </EntryFormWrapper>
      </div>
    </>
  );
};
