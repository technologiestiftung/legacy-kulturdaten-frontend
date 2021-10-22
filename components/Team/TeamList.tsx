import styled from '@emotion/styled';
import { Role } from '../../lib/api/types/role';
import { User } from '../../lib/api/types/user';
import { useT } from '../../lib/i18n';
import { Button } from '../button';
import { useUser } from '../user/useUser';

const StyledTeamList = styled.div``;

const StyledTeamListList = styled.ul``;

const StyledTeamListListTitleRow = styled.ul``;

const StyledTeamListItem = styled.li<{ isCurrentUser?: boolean }>``;

const StyledTeamListItemTitle = styled.div``;

const StyledTeamListItemMail = styled.div``;

const StyledTeamListItemStatus = styled.div``;

const StyledTeamListItemRole = styled.div``;

const StyledTeamListItemRemove = styled.div``;

interface TeamListProps {
  roles: Role[];
  onChange: (roles: Role[]) => void;
}

export const TeamList: React.FC<TeamListProps> = ({ roles, onChange }: TeamListProps) => {
  const t = useT();
  const { user: currentUser } = useUser();

  return (
    <StyledTeamList>
      <StyledTeamListList>
        <StyledTeamListListTitleRow></StyledTeamListListTitleRow>
        {roles?.map((role, index) => {
          const user = role.relations?.user as User;

          return user ? (
            <StyledTeamListItem key={index} isCurrentUser={currentUser?.id === user?.id}>
              <StyledTeamListItemTitle>
                <StyledTeamListItemMail>{user.attributes?.email}</StyledTeamListItemMail>
                {role.attributes?.status && (
                  <StyledTeamListItemStatus>{role.attributes?.status}</StyledTeamListItemStatus>
                )}
              </StyledTeamListItemTitle>
              <StyledTeamListItemRole>{role.attributes.role}</StyledTeamListItemRole>
              <StyledTeamListItemRemove>
                <Button>{t('general.remove')}</Button>
              </StyledTeamListItemRemove>
            </StyledTeamListItem>
          ) : null;
        })}
      </StyledTeamListList>
    </StyledTeamList>
  );
};
