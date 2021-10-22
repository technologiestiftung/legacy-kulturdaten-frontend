import { useEffect, useMemo, useState } from 'react';
import { ApiCall, useApiCall } from '../../../lib/api';
import { CategoryEntry } from '../../../lib/api/types/general';
import { Category, CategoryEntryPage, useEntry } from '../../../lib/categories';
import { Save } from '../../EntryForm/Save';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { useSaveDate } from '../helpers/useSaveDate';
import { useT } from '../../../lib/i18n';
import { EntryFormHook } from '../helpers/form';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { TeamList } from '../../Team/TeamList';
import { Organizer, OrganizerRole } from '../../../lib/api/types/organizer';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { OrganizerDelete, organizerDeleteFactory } from '../../../lib/api/routes/organizer/delete';
import { OrganizerUpdate, organizerUpdateFactory } from '../../../lib/api/routes/organizer/update';
import { Textarea } from '../../textarea';
import { usePseudoUID } from '../../../lib/uid';
import { Button, ButtonColor, ButtonSize } from '../../button';
import { useLoadingScreen } from '../../Loading/LoadingScreen';
import { ParsedUrlQuery } from 'querystring';
import { Role, RoleName } from '../../../lib/api/types/role';
import { User } from '../../../lib/api/types/user';
import { useUser } from '../../user/useUser';

const regex =
  /^[-!#-'*+\/-9=?^-~]+(?:\.[-!#-'*+\/-9=?^-~]+)*@[-!#-'*+\/-9=?^-~]+(?:\.[-!#-'*+\/-9=?^-~]+)+(?:\s*[,;\n]\s*(?:[-!#-'*+\/-9=?^-~]+(?:\.[-!#-'*+\/-9=?^-~]+)*@[-!#-'*+\/-9=?^-~]+(?:\.[-!#-'*+\/-9=?^-~]+)+)?)*$/;

const useTeamAddForm = ({ category, query }: { category: Category; query: ParsedUrlQuery }) => {
  const [members, setMembers] = useState<string>('');
  const uid = usePseudoUID();
  const loadingScreen = useLoadingScreen();
  const t = useT();
  const call = useApiCall();
  const { entry, mutate } = useEntry(category, query);

  const valid = useMemo(() => members.length === 0 || regex.test(members), [members]);

  return (
    <div>
      <EntryFormHead title={t('team.invite.title') as string} />
      <FormGrid>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            label={t('team.invite.label') as string}
            placeholder={t('team.invite.placeholder') as string}
            id={`${uid}-invite`}
            value={members}
            rows={4}
            onChange={(e) => setMembers(e.target.value)}
            valid={valid}
          />
        </FormItem>
        <FormItem width={FormItemWidth.full}>
          <Button
            size={ButtonSize.big}
            color={ButtonColor.black}
            onClick={async () => {
              if (members?.length > 0 && valid) {
                const membersArray = members.replace(' ', '').replace(';', ',').split(',');

                loadingScreen(t('team.invite.loading'), async () => {
                  try {
                    const resp = await call<OrganizerUpdate>(organizerUpdateFactory, {
                      id: entry?.data.id,
                      entry: {
                        relations: {
                          roles: membersArray.map((member) => ({
                            attributes: {
                              role: 'editor',
                              email: member,
                            },
                          })),
                        },
                      },
                    });

                    if (resp.status === 200) {
                      mutate();
                      setMembers('');
                      return { success: true };
                    }

                    return { success: false, e: t('general.serverProblem') };
                  } catch (e) {
                    console.error(e);
                    return { success: false, e: t('general.serverProblem') };
                  }
                });
              }
            }}
          >
            {t('team.invite.button')}
          </Button>
        </FormItem>
      </FormGrid>
    </div>
  );
};

const useTeamForm: EntryFormHook = ({ category, query }) => {
  const t = useT();
  const call = useApiCall();
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);

  const [roles, setRoles] = useState<OrganizerRole[]>([]);
  const [rolesFromApi, setRolesFromApi] = useState<OrganizerRole[]>([]);
  const { user } = useUser();

  const userIsOwner = useMemo(
    () =>
      rolesFromApi?.find(
        (role) =>
          role.attributes.isActive && ((role as Role).relations.user as User)?.id === user.id
      )?.attributes.role === RoleName.owner,
    [rolesFromApi, user?.id]
  );

  const initialRoles = useMemo(
    () => entry?.data?.relations?.roles,
    [entry?.data?.relations?.roles]
  );

  const pristine = useMemo(
    () => JSON.stringify(roles) === JSON.stringify(rolesFromApi),
    [roles, rolesFromApi]
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
          <TeamList roles={roles} onChange={setRoles} userIsOwner={userIsOwner} />
        </FormItem>
      </FormGrid>
    </div>
  );

  return {
    renderedForm: renderedForm,
    hint: false,
    pristine,
    valid: true,
    reset: () => undefined,
    submit: async () => {
      try {
        const roleIds = roles.map((role) => role.id);

        const deletedRoleIds = rolesFromApi
          .map((role) => role.id)
          .filter((roleId) => !roleIds.includes(roleId));

        if (deletedRoleIds?.length > 0) {
          const deleteResp = await call<OrganizerDelete>(organizerDeleteFactory, {
            id: entry?.data.id,
            entry: {
              relations: {
                roles: deletedRoleIds,
              },
            },
          });
        }

        const resp = await call<OrganizerUpdate>(organizerUpdateFactory, {
          id: entry?.data.id,
          entry: {
            relations: {
              roles,
            },
          },
        });

        if (resp.status === 200) {
          mutate();
        }
      } catch (e) {
        console.error(e);
      }
    },
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

  const inviteForm = useTeamAddForm({ category, query });

  const pristine = teamPristine;

  return (
    <>
      {renderedEntryHeader}
      <div>
        <Save
          onClick={async () => {
            teamSubmit();
          }}
          active={!pristine}
          date={formattedDate}
          valid={true}
          hint={false}
        />
        <EntryFormWrapper>
          <EntryFormContainer>{inviteForm}</EntryFormContainer>
          <EntryFormContainer>{teamForm}</EntryFormContainer>
        </EntryFormWrapper>
      </div>
    </>
  );
};
