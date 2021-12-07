import { apiRoutes, ApiCall, ApiRoute, ApiCallFactory, makeBearer } from '../..';
import { OrganizerType } from '../../types/organizer';

/**
 * /auth/info
 */

export interface OrganizerTypeList extends ApiCall {
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
      data: OrganizerType[];
    };
  };
}

export const organizerTypeListFactory: ApiCallFactory = (
  token: OrganizerTypeList['request']['headers']['Authorization']
): OrganizerTypeList => ({
  request: {
    route: apiRoutes.organizerTypeList(),
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
