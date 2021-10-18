import { apiRoutes, ApiCall, ApiRoute, ApiCallFactory } from '../..';
import { OfferType } from '../../types/offer';

/**
 * /auth/info
 */

export interface OfferMainTypeList extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'GET';
  };
  response: {
    status: 200;
    body: {
      data: OfferType[];
    };
  };
}

export const offerMainTypeListFactory: ApiCallFactory = (): OfferMainTypeList => ({
  request: {
    route: apiRoutes.offerMainTypeList(),
    method: 'GET',
  },
  response: {
    status: 200,
    body: undefined,
  },
});
