import { apiRoutes, ApiCall, ApiRoute, ApiCallFactory } from '../..';
import { Tag } from '../../types/tag';

/**
 * /auth/info
 */

export interface TagList extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'GET';
  };
  response: {
    status: 200;
    body: {
      data: Tag[];
    };
  };
}

export const tagListFactory: ApiCallFactory = (): TagList => ({
  request: {
    route: apiRoutes.tagList(),
    method: 'GET',
  },
  response: {
    status: 200,
    body: undefined,
  },
});
