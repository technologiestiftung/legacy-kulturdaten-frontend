import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';

/**
 * /auth/info
 */

export interface OrganizerDelete extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'DELETE';
    headers: {
      Authorization: string;
    };
    body: null;
  };
  response: {
    status: 200;
    body: {
      data: null;
      meta: {
        message: 'Organizer deleted successfully';
      };
    };
  };
}

export const organizerDeleteFactory = (
  token: OrganizerDelete['request']['headers']['Authorization'],
  query: { id: string }
): OrganizerDelete => ({
  request: {
    route: apiRoutes.organizerDelete({ id: query.id }),
    method: 'DELETE',
    headers: {
      Authorization: makeBearer(token),
    },
    body: null,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
