import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useT } from '../../../lib/i18n';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { useUser } from '../../user/useUser';
import { EntryHeader } from '../../EntryHeader';
import { LocaleSwitch } from '../../navigation/LocaleSwitch';

export const UserSettingsPage: React.FC = () => {
  const t = useT();
  const { user } = useUser();

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
            <EntryFormHead title="Locale Switch " />
            <FormGrid>
              <FormItem width={FormItemWidth.full}>
                <div>stuff</div>
                <LocaleSwitch />
              </FormItem>
            </FormGrid>
          </EntryFormContainer>
          <EntryFormContainer>
            <EntryFormHead title="Legal links " />
            <FormGrid>
              <FormItem width={FormItemWidth.full}>
                <div>stuff</div>
              </FormItem>
            </FormGrid>
          </EntryFormContainer>
        </EntryFormWrapper>
      </div>
    </>
  );
};
