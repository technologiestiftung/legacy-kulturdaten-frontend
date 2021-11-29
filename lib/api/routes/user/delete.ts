import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
import { User } from '../../types/user';

/**
 * /user
 */

export type UserDelete = ApiCall & {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'DELETE';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: User;
  };
  response: {
    status: 200;
    body: {
      data: User;
      meta: {
        message: 'Offer updated successfully';
      };
    };
  };
};

export const userDeleteFactory = (
  token: UserDelete['request']['headers']['Authorization'],
  query: {
    user: User;
  }
): UserDelete => ({
  request: {
    route: apiRoutes.userUpdate(),
    method: 'DELETE',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: query.user,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
