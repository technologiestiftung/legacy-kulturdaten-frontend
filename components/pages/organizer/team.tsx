import { useEffect, useMemo, useState } from 'react';
import { ApiCall } from '../../../lib/api';
import { CategoryEntry } from '../../../lib/api/types/general';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { Save } from '../../EntryForm/Save';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { useSaveDate } from '../helpers/useSaveDate';
import { useT } from '../../../lib/i18n';
import { EntryFormHook } from '../helpers/form';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { TeamList } from '../../Team/TeamList';
import { Role } from '../../../lib/api/types/role';
import { Organizer } from '../../../lib/api/types/organizer';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';

const useTeamForm: EntryFormHook = ({ category, query }) => {
  const t = useT();
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);

  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesFromApi, setRolesFromApi] = useState<Role[]>([]);

  const initialRoles = useMemo(
    () => entry?.data?.relations?.roles,
    [entry?.data?.relations?.roles]
  );

  useEffect(() => {
    if (JSON.stringify(initialRoles) !== JSON.stringify(rolesFromApi)) {
      setRoles(initialRoles);
      setRolesFromApi(initialRoles);
    }
  }, [initialRoles, rolesFromApi]);

  const renderedForm = (
    <div>
      <EntryFormHead title={t('team.list.title') as string} />
      <FormGrid>
        <FormItem width={FormItemWidth.full}>
          <TeamList roles={roles} onChange={() => undefined} />
        </FormItem>
      </FormGrid>
    </div>
  );

  return {
    renderedForm: renderedForm,
    hint: false,
    pristine: true,
    valid: true,
    reset: () => undefined,
    submit: () => undefined,
  };
};

export const OrganizerTeamPage: React.FC<CategoryEntryPage> = <
  T extends CategoryEntry,
  C extends ApiCall
>({
  category,
  query,
}: CategoryEntryPage) => {
  const t = useT();
  const renderedEntryHeader = useEntryHeader(
    { category, query },
    t('menu.start.items.team') as string,
    true,
    true
  );
  const { entry } = useEntry<T, C>(category, query);
  const formattedDate = useSaveDate(entry);

  const {
    renderedForm: teamForm,
    pristine: teamPristine,
    submit: teamSubmit,
  } = useTeamForm({ category, query }, true, false);

  return (
    <>
      {renderedEntryHeader}
      <div>
        <Save
          onClick={async () => {
            // submit();
          }}
          active={false}
          date={formattedDate}
          valid={true}
          hint={false}
        />
        <EntryFormWrapper>
          <EntryFormContainer>{teamForm}</EntryFormContainer>
        </EntryFormWrapper>
      </div>
    </>
  );
};
