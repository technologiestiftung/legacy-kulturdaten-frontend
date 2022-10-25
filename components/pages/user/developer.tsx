import { StyledEntryFormContainer, EntryFormWrapper, StyledRequiredInfoText } from '../../EntryForm/wrappers';
import { useT } from '../../../lib/i18n';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { DashboardLinkList } from '../../Dasboard/DashboardLinkList';
import { StandardLinkType } from '../../../lib/generalTypes';
import { Info, InfoColor } from '../../info';
import { Input, InputType } from '../../input';
import { useMemo, useState } from 'react';
import { Button, ButtonColor, ButtonSize, ButtonType } from '../../button';
import { Textarea } from '../../textarea';
import { SettingsHeader } from './SettingsHeader';
import { useApiCall } from '../../../lib/api';
import { AppTokenCreate, appTokenCreateFactory } from '../../../lib/api/routes/appToken/create';
import { useAppTokenList } from '../../../lib/appTokenList';
import { AppTokenList } from '../../AppTokenList';
import { AppTokenDelete, appTokenDeleteFactory } from '../../../lib/api/routes/appToken/delete';

const UserApiTokens: React.FC = () => {
  const t = useT();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  const { appTokens, mutate: mutateAppTokens } = useAppTokenList();

  const tokenNameValid = useMemo(() => {
    if (appTokens?.find((token) => token.name.trim() === name.trim())) {
      return false;
    }

    return true;
  }, [appTokens, name]);

  const call = useApiCall();

  return (
    <>
      <StyledEntryFormContainer>
        <EntryFormHead
          title={t('settings.api.titleCreate') as string}
          tooltip={t('settings.api.titleCreateTooltip')}
        />
        <StyledRequiredInfoText/>
        <form
          onSubmit={async(e) => {
            e.preventDefault();
            e.stopPropagation();

            if (tokenNameValid) {
                try {
                  const resp = await call<AppTokenCreate>(appTokenCreateFactory, {
                    appToken: {
                      attributes: {
                        name,
                        url,
                        description,
                      },
                    },
                  });

                  if (resp.status === 200) {
                    setName('');
                    setDescription('');
                    setUrl('');
                    mutateAppTokens();
                    return { success: true };
                  }
                } catch (e) {
                  console.error(e);

                  return { success: false, error: t('general.serverProblem') };
                }
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
                error={!tokenNameValid ? (t('settings.api.uniqueNameError') as string) : undefined}
              />
            </FormItem>
            <FormItem width={FormItemWidth.half}>
              <Input
                type={InputType.url}
                autoComplete="url"
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
                disabled={name?.length < 1 || !tokenNameValid}
              >
                {t('settings.api.createButton') as string}
              </Button>
            </FormItem>
            <FormItem width={FormItemWidth.full}>
              <Info color={InfoColor.white}>{t('settings.api.info')}</Info>
            </FormItem>
          </FormGrid>
        </form>
      </StyledEntryFormContainer>
      {appTokens?.length > 0 && (
        <StyledEntryFormContainer>
          <EntryFormHead title={t('settings.api.titleList') as string} />
          <FormGrid>
            <FormItem width={FormItemWidth.full}>
              <AppTokenList
                tokens={appTokens}
                onRemove={async (id) => {
                  try {
                    const resp = await call<AppTokenDelete>(appTokenDeleteFactory, {
                      appToken: {
                        id,
                      },
                    });

                    if (resp.status === 200) {
                      mutateAppTokens();
                      return { success: true };
                    }

                    return { success: false, error: t('general.serverProblem') };
                  } catch (e) {
                    return { success: false, error: t('general.serverProblem') };
                  }
                }}
              />
            </FormItem>
          </FormGrid>
        </StyledEntryFormContainer>
      )}
    </>
  );
};

export const UserDeveloperPage: React.FC = () => {
  const t = useT();

  return (
    <>
      <SettingsHeader />
      <div>
        <EntryFormWrapper>
          <UserApiTokens />
          <StyledEntryFormContainer>
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
          </StyledEntryFormContainer>
        </EntryFormWrapper>
      </div>
    </>
  );
};
