import { apiRoutes, ApiCall, ApiRoute, ApiCallFactory, makeBearer } from '../..';
import { OfferType } from '../../types/offer';

/**
 * /auth/info
 */

export interface OfferMainTypeList extends ApiCall {
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

export const offerMainTypeListFactory: ApiCallFactory = (
  token: OfferMainTypeList['request']['headers']['Authorization']
): OfferMainTypeList => ({
  request: {
    route: apiRoutes.offerMainTypeList(),
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
