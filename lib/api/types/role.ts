import { Categories } from '../../../config/categories';
import { CategoryEntry } from './general';
import { User } from './user';

export enum RoleName {
  owner = 'owner',
  editor = 'editor',
}

export type Role = {
  id?: number;
  type?: 'organizerrole' | 'offerrole' | 'locationrole';
  attributes: {
    role: RoleName;
    isActive?: boolean;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  relations: {
    [key in Categories]?: CategoryEntry['data'];
  } & {
    user?: User | string;
  };
};
