import { useApiCall } from '../../lib/api';
import { UserUpdate, userUpdateFactory } from '../../lib/api/routes/user/update';
import { useT } from '../../lib/i18n';
import { Button, ButtonSize } from '../button';
import { useConfirmScreen } from '../Confirm/ConfirmScreen';
import { EntryFormHead } from '../EntryForm/EntryFormHead';
import { StyledEntryFormContainer } from '../EntryForm/wrappers';
import { useLoadingScreen } from '../Loading/LoadingScreen';
import { FormGrid, FormItem, FormItemWidth } from '../pages/helpers/formComponents';
import { useUser } from '../user/useUser';

export const DeleteUser: React.FC = () => {
  const { user, mutateUserInfo } = useUser();
  const confirmScreen = useConfirmScreen();
  const loadingScreen = useLoadingScreen();
  const t = useT();
  const call = useApiCall();

  return (
    <StyledEntryFormContainer>
      <EntryFormHead title={t('settings.deletion.title') as string} />
      <FormGrid>
        <FormItem width={FormItemWidth.full}>{t('settings.deletion.text')}</FormItem>
        <FormItem width={FormItemWidth.full}>
          <Button
            size={ButtonSize.big}
            onClick={() =>
              confirmScreen({
                title: t('settings.deletion.title') as string,
                message: t('settings.deletion.confirm', { email: user?.attributes?.email }),
                confirmText: t('settings.deletion.confirmButton') as string,
                onConfirm: async () => {
                    try {
                      const resp = await call<UserUpdate>(userUpdateFactory, {
                        user: {
                          attributes: {
                            deletionRequestedAt: new Date().toISOString(),
                          },
                        },
                      });

                      if (resp.status === 200) {
                        mutateUserInfo();
                      }

                    } catch (e) {
                      console.log(e)
                    }
                },
                condition: {
                  label: t('settings.deletion.confirmInputLabel') as string,
                  value: user?.attributes?.email,
                  error: t('settings.deletion.confirmError') as string,
                },
              })
            }
          >
            {t('settings.deletion.button')}
          </Button>
        </FormItem>
      </FormGrid>
    </StyledEntryFormContainer>
  );
};
