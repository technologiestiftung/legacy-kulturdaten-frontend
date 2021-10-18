import { Categories } from '../../../config/categories';
import { CategoryEntry } from './general';

export enum RoleName {
  owner = 'owner',
  editor = 'editor',
}

export type Role = {
  id: number;
  type: 'organizerrole' | 'offerrole' | 'locationrole';
  attributes: {
    role: RoleName;
  };
  relations: {
    [key in Categories]?: CategoryEntry['data'];
  };
};
