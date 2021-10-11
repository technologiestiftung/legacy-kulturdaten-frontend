import { apiRoutes, ApiCall, ApiRoute, ApiCallFactory } from '../..';
import { OfferType } from '../../types/offer';

/**
 * /auth/info
 */

export interface OfferTypeList extends ApiCall {
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

export const offerTypeListFactory: ApiCallFactory = (): OfferTypeList => ({
  request: {
    route: apiRoutes.offerTypeList(),
    method: 'GET',
  },
  response: {
    status: 200,
    body: undefined,
  },
});
