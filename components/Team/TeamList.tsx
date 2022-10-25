import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { OrganizerRole, OrganizerRolePending } from '../../lib/api/types/organizer';
import { Role, RoleName } from '../../lib/api/types/role';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { Button } from '../button';
import { mq } from '../globals/Constants';
import { Select } from '../select';
import { useUser } from '../user/useUser';
import { User } from '../../lib/api/types/user';
import { useMemo } from 'react';
import { Info, InfoColor } from '../info';

export const StyledTeamList = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  `;
  
export const StyledTeamListScrollBox = styled.div`
  border: 1px solid var(--grey-400);
  border-radius: 0.75rem;
  overflow: hidden;
`;

export const StyledTeamListList = styled.table`
  width: 100%;
`;

const teamListRowGrid = css`
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 0.75rem;
  row-gap: 0.375rem;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: calc(50% - 1.5rem) 25% 25%;
  }
`;
const StyledTeamListHeader = styled.th`
  text-align: start;
`;

export const StyledTeamListItem = styled.tr<{ isCurrentUser?: boolean }>`
  ${teamListRowGrid}
  padding: 0.75rem 1.125rem 1.125rem;
  border-bottom: 1px solid var(--grey-400);
  background: ${({ isCurrentUser }) => (isCurrentUser ? 'var(--grey-200)' : 'var(--white)')};

  &:first-of-type {
    border-top-left-radius: calc(0.75rem - 1px);
    border-top-right-radius: calc(0.75rem - 1px);
  }

  ${mq(Breakpoint.mid)} {
    border-radius: 0;
    padding: 1.125rem 1.125rem;
  }

  &:last-of-type {
    border-bottom: none;
    border-bottom-right-radius: calc(0.75rem - 1px);
    border-bottom-left-radius: calc(0.75rem - 1px);
  }
`;

export const StyledTeamListListTitleRow = styled.tr`
  ${teamListRowGrid}
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  padding: 0.75rem 1.125rem;
  border-bottom: 1px solid var(--grey-400);
`;

export const StyledTeamListItemTitle = styled.td`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  padding: 0.375rem 0;
  grid-column: span 2;

  ${mq(Breakpoint.mid)} {
    grid-column: span 1;
  }
`;

export const StyledTeamListItemText = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 400;
`;

export const StyledTeamListItemTextBold = styled.div`
  font-weight: 700;
  word-break: break-all;
`;

const StyledTeamListItemMail = styled.div`
  font-weight: 700;
  word-break: break-all;
`;

const StyledTeamListItemStatus = styled.div``;

const StyledTeamListItemRole = styled.td``;

const StyledTeamListItemRemove = styled.td<{ hide: boolean }>`
  ${mq(Breakpoint.mid)} {
    justify-self: flex-end;
  }

  ${({ hide }) =>
    hide &&
    css`
      visibility: hidden;
      pointer-events: none;
      opacity: 0;
    `}
`;

interface TeamListProps {
  roles: OrganizerRole[];
  onChange: (roles: OrganizerRole[]) => void;
  userIsOwner: boolean;
}

export const TeamList: React.FC<TeamListProps> = ({
  roles,
  onChange,
  userIsOwner,
}: TeamListProps) => {
  const uid = usePseudoUID();
  const t = useT();
  const { user: currentUser } = useUser();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);

  const ownersCount = useMemo(
    () => roles?.filter((role) => role.attributes.role === RoleName.owner)?.length,
    [roles]
  );

  return (
    <StyledTeamList>
      <StyledTeamListScrollBox>
        <StyledTeamListList>
          {isMidOrWider && (
            <thead>
              <StyledTeamListListTitleRow>
                <StyledTeamListHeader>{t('team.list.email')}</StyledTeamListHeader>
                <StyledTeamListHeader>{t('team.list.role')}</StyledTeamListHeader>
              </StyledTeamListListTitleRow>
            </thead>
          )}
          <tbody>
            {roles?.map((role, index) => {
              const isPendingUser = !role?.attributes.isActive;

              const email = isPendingUser
                ? (role as OrganizerRolePending).attributes.email
                : ((role as Role).relations?.user as User)?.attributes.email;

              const isCurrentUser = currentUser?.attributes?.email === email;
              const showRemove = !isCurrentUser && userIsOwner;
              const isOwnerRole = role.attributes?.role === RoleName.owner;

              const canNotBeRemoved = isOwnerRole && ownersCount < 2;

              return (
                <StyledTeamListItem key={index} isCurrentUser={isCurrentUser}>
                  <StyledTeamListItemTitle>
                    <StyledTeamListItemMail>{email}</StyledTeamListItemMail>
                    {isPendingUser && (
                      <StyledTeamListItemStatus>({t('team.list.pending')})</StyledTeamListItemStatus>
                    )}
                  </StyledTeamListItemTitle>
                  <StyledTeamListItemRole>
                    <Select
                      id={`${uid}-roles`}
                      value={roles.length === 1 ? RoleName.owner : role.attributes?.role || ''}
                      disabled={!userIsOwner || roles.length === 1 || canNotBeRemoved}
                      onChange={(e) => {
                        onChange([
                          ...roles.slice(0, index),
                          {
                            ...role,
                            attributes: {
                              ...role.attributes,
                              role: canNotBeRemoved ? RoleName.owner : (e.target.value as RoleName),
                            },
                          } as OrganizerRole,
                          ...roles.slice(index + 1),
                        ]);
                      }}
                    >
                      <option value={RoleName.owner}>{t('team.roles.owner')}</option>
                      <option value={RoleName.editor}>{t('team.roles.editor')}</option>
                    </Select>
                  </StyledTeamListItemRole>
                  <StyledTeamListItemRemove hide={!showRemove || canNotBeRemoved}>
                    <Button
                      onClick={() =>
                        showRemove && !canNotBeRemoved
                          ? onChange(roles.filter((role, roleIndex) => roleIndex !== index))
                          : undefined
                      }
                    >
                      {t('general.remove')}
                    </Button>
                  </StyledTeamListItemRemove>
                </StyledTeamListItem>
              );
            })}
          </tbody>
        </StyledTeamListList>
      </StyledTeamListScrollBox>
      {userIsOwner && <Info color={InfoColor.white}>{t('team.list.info')}</Info>}
    </StyledTeamList>
  );
};
