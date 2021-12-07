import { apiRoutes, ApiCall, ApiRoute, ApiCallFactory, makeBearer } from '../..';
import { OfferType } from '../../types/offer';

/**
 * /auth/info
 */

export interface OfferTypeList extends ApiCall {
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
      data: OfferType[];
    };
  };
}

export const offerTypeListFactory: ApiCallFactory = (
  token: OfferTypeList['request']['headers']['Authorization']
): OfferTypeList => ({
  request: {
    route: apiRoutes.offerTypeList(),
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
