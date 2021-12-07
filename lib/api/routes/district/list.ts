import { apiRoutes, ApiCall, ApiRoute, ApiCallFactory, makeBearer } from '../..';
import { District } from '../../types/district';

/**
 * /district
 */

export interface DistrictList extends ApiCall {
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
      data: District[];
    };
  };
}

export const districtListFactory: ApiCallFactory = (
  token: DistrictList['request']['headers']['Authorization']
): DistrictList => ({
  request: {
    route: apiRoutes.districtList(),
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
