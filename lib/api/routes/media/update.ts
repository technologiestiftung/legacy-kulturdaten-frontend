import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
import { Media } from '../../types/media';

/**
 * /auth/info
 */

export type MediaUpdate = ApiCall & {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'PATCH';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: Media;
  };
  response: {
    status: 200;
    body: Media;
  };
};

export const mediaUpdateFactory = (
  token: MediaUpdate['request']['headers']['Authorization'],
  query: {
    id: string;
    media: Media;
  }
): MediaUpdate => ({
  request: {
    route: apiRoutes.mediaUpdate({ id: query.id }),
    method: 'PATCH',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: query.media,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
