import { useMemo } from 'react';
import { useAdminMode } from '../components/Admin/AdminContext';
import { useUser } from '../components/user/useUser';
import { Role, RoleName } from './api/types/role';
import { User } from './api/types/user';
import { useOrganizer } from './useOrganizer';

export const useUserIsOwner = () => {
  const { adminModeActive } = useAdminMode();
  const { isSuperuser, user } = useUser();
  const entry = useOrganizer();

  const userIsOwner = useMemo(
    () =>
      (adminModeActive && isSuperuser) ||
      entry?.data?.relations?.roles?.find(
        (role) =>
          role.attributes.isActive && ((role as Role).relations.user as User)?.id === user?.id
      )?.attributes.role === RoleName.owner,
    [adminModeActive, isSuperuser, entry?.data?.relations?.roles, user?.id]
  );

  return userIsOwner;
};
