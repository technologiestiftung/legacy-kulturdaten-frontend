import { apiRoutes, ApiCall, ApiRoute, ApiCallFactory, makeBearer } from '../..';
import { Tag } from '../../types/tag';

/**
 * /auth/info
 */

export interface TagList extends ApiCall {
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
      data: Tag[];
    };
  };
}

export const tagListFactory: ApiCallFactory = (
  token: TagList['request']['headers']['Authorization']
): TagList => ({
  request: {
    route: apiRoutes.tagList(),
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
