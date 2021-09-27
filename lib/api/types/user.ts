import { Language } from '../../../config/locale';

export enum UserStatus {
  active = 'active',
  pending = 'pending',
}

export type User = {
  data: {
    id: number;
    type: 'user';
    attributes: {
      email: string;
      rememberMeToken: string;
      status: UserStatus;
      createdAt: string;
      updatedAt: string;
    };
  };
  meta: {
    language: Language;
  };
};
