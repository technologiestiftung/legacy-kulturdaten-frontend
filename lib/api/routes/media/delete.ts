import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';

/**
 * /auth/info
 */

export interface MediaDelete extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'DELETE';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: null;
  };
  response: {
    status: 200;
    body: {
      data: null;
      meta: {
        message: 'Media deleted successfully';
      };
    };
  };
}

export const mediaDeleteFactory = (
  token: MediaDelete['request']['headers']['Authorization'],
  query: { id: string }
): MediaDelete => ({
  request: {
    route: apiRoutes.mediaDelete({ id: query.id }),
    method: 'DELETE',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: null,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
