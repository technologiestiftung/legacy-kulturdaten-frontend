import { useEffect, useMemo, useState } from 'react';
import { useApiCall } from '../../../lib/api';
import { Category, CategoryEntryPage, useEntry } from '../../../lib/categories';
import { Save } from '../../EntryForm/Save';
import { StyledEntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { useSaveDate } from '../helpers/useSaveDate';
import { useT } from '../../../lib/i18n';
import { EntryFormHook } from '../helpers/form';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { TeamList } from '../../Team/TeamList';
import { Organizer, OrganizerRole, OrganizerRolePending } from '../../../lib/api/types/organizer';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { OrganizerDelete, organizerDeleteFactory } from '../../../lib/api/routes/organizer/delete';
import { OrganizerUpdate, organizerUpdateFactory } from '../../../lib/api/routes/organizer/update';
import { Textarea } from '../../textarea';
import { usePseudoUID } from '../../../lib/uid';
import { Button, ButtonColor, ButtonSize } from '../../button';
import { ParsedUrlQuery } from 'querystring';
import { Role } from '../../../lib/api/types/role';
import { User } from '../../../lib/api/types/user';
import { Info, InfoColor } from '../../info';
import { useConfirmExit } from '../../../lib/useConfirmExit';
import { useUserIsOwner } from '../../../lib/useUserIsOwner';

const maxInvites = 50;

const regex =
  /^[-!#-'*+\/-9=?^-~]+(?:\.[-!#-'*+\/-9=?^-~]+)*@[-!#-'*+\/-9=?^-~]+(?:\.[-!#-'*+\/-9=?^-~]+)+(?:\s*[,;\n]\s*(?:[-!#-'*+\/-9=?^-~]+(?:\.[-!#-'*+\/-9=?^-~]+)*@[-!#-'*+\/-9=?^-~]+(?:\.[-!#-'*+\/-9=?^-~]+)+)?)*$/;

const useTeamAddForm = ({ category, query }: { category: Category; query: ParsedUrlQuery }) => {
  const [members, setMembers] = useState<string>('');
  const [blurred, setBlurred] = useState(false);
  const uid = usePseudoUID();
  const t = useT();
  const call = useApiCall();
  const { entry, mutate } = useEntry(category, query);

  const valid = useMemo(() => members.length === 0 || regex.test(members), [members]);
  const empty = useMemo(() => members.length === 0, [members]);
  const membersArray = useMemo(
    () =>
      valid && !empty
        ? members.replaceAll(' ', '').replaceAll(';', ',').split(',').slice(0, maxInvites)
        : [],
    [members, valid, empty]
  );

  return (
    <div>
      <EntryFormHead title={t('team.invite.title') as string} />
      <FormGrid>
      <FormItem width={FormItemWidth.full}>
          <Info color={InfoColor.white} noMaxWidth>
            <span>{t('team.invite.hint', { max: maxInvites })}</span>
            <span>{t('team.invite.hint2')}</span>
          </Info>
        </FormItem>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            label={t('team.invite.label') as string}
            placeholder={t('team.invite.placeholder') as string}
            id={`${uid}-invite`}
            value={members}
            rows={4}
            onChange={(e) => setMembers(e.target.value)}
            valid={valid}
            onBlur={() => setBlurred(true)}
          />
        </FormItem>
        {blurred && !valid && (
          <FormItem width={FormItemWidth.full}>
            <Info noMaxWidth>{t('team.invite.invalid')}</Info>
          </FormItem>
        )}
        <FormItem width={FormItemWidth.full}>
          <Button
            size={ButtonSize.big}
            color={ButtonColor.black}
            disabled={empty || !valid}
            onClick={async () => {
              if (membersArray.length > 0) {
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

  const userIsOwner = useUserIsOwner();

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
    pristine,
    valid: true,
    reset: () => {
      setRoles(initialRoles);
    },
    submit: async () => {
      try {
        const roleIds = roles.map((role) => role.id);

        const deletedRoleIds = rolesFromApi
          .map((role) => role.id)
          .filter((roleId) => !roleIds.includes(roleId));

        if (deletedRoleIds?.length > 0) {
          await call<OrganizerDelete>(organizerDeleteFactory, {
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
              roles: roles.map((role) => ({
                attributes: {
                  email:
                    (role as OrganizerRolePending).attributes?.email ||
                    ((role as Role).relations.user as User).attributes?.email,
                  role: role.attributes.role,
                },
              })),
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

export const OrganizerTeamPage: React.FC<CategoryEntryPage> = ({
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
  const { entry } = useEntry<Organizer, OrganizerShow>(category, query);
  const formattedDate = useSaveDate(entry);

  const userIsOwner = useUserIsOwner();

  const {
    renderedForm: teamForm,
    pristine: teamPristine,
    submit: teamSubmit,
    reset: teamReset,
  } = useTeamForm({ category, query, loaded: true });

  const inviteForm = useTeamAddForm({ category, query });

  const pristine = teamPristine;

  const message = t('save.confirmExit') as string;

  const shouldWarn = useMemo(
    () => !pristine && typeof entry?.data !== 'undefined',
    [pristine, entry?.data]
  );

  useConfirmExit(shouldWarn, message, () => {
    teamReset();
  });

  return (
    <>
      {renderedEntryHeader}
      <div>
        {userIsOwner && (
          <Save
            onClick={async () => {
              teamSubmit();
            }}
            active={!pristine}
            date={formattedDate}
            valid={true}
          />
        )}
        <EntryFormWrapper>
          {userIsOwner && <StyledEntryFormContainer>{inviteForm}</StyledEntryFormContainer>}
          <StyledEntryFormContainer>{teamForm}</StyledEntryFormContainer>
        </EntryFormWrapper>
      </div>
    </>
  );
};
