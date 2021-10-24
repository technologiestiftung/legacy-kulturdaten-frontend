import { apiRoutes, ApiCall, ApiRoute, ApiCallFactory } from '../..';
import { District } from '../../types/district';

/**
 * /district
 */

export interface DistrictList extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'GET';
  };
  response: {
    status: 200;
    body: {
      data: District[];
    };
  };
}

export const districtListFactory: ApiCallFactory = (): DistrictList => ({
  request: {
    route: apiRoutes.districtList(),
    method: 'GET',
  },
  response: {
    status: 200,
    body: undefined,
  },
});
