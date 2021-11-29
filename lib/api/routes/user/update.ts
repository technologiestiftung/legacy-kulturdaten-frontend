import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
import { User } from '../../types/user';

/**
 * /user
 */

export type UserUpdate = ApiCall & {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
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

export const userUpdateFactory = (
  token: UserUpdate['request']['headers']['Authorization'],
  query: {
    user: User;
  }
): UserUpdate => ({
  request: {
    route: apiRoutes.userUpdate(),
    method: 'POST',
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
