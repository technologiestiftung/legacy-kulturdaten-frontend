import { apiRoutes, ApiCall, ApiRoute, ApiCallFactory } from '../..';
import { OrganizerType } from '../../types/organizer';

/**
 * /auth/info
 */

export interface OrganizerTypeList extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'GET';
  };
  response: {
    status: 200;
    body: {
      data: OrganizerType[];
    };
  };
}

export const organizerTypeListFactory: ApiCallFactory = (): OrganizerTypeList => ({
  request: {
    route: apiRoutes.organizerTypeList(),
    method: 'GET',
  },
  response: {
    status: 200,
    body: undefined,
  },
});
