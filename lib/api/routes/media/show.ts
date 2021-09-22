import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
import { Media } from '../../types/media';

/**
 * /auth/info
 */

export interface MediaShow extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'GET';
    headers: {
      Authorization: string;
    };
  };
  response: {
    status: 200;
    body: {
      data: Media;
    };
  };
}

export const mediaShowFactory = (
  token: MediaShow['request']['headers']['Authorization'],
  query: { id: string }
): MediaShow => ({
  request: {
    route: apiRoutes.mediaShow({ id: query.id }),
    method: 'GET',
    headers: {
      Authorization: makeBearer(token),
    },
  },
  response: {
    status: 200,
    body: undefined,
  },
});
