import { apiRoutes, makeBearer, ApiCall, ApiRoute, ApiCallFactory } from '../../..';
import { OfferDate } from '../../../types/offer';

/**
 * /auth/info
 */

export interface OfferDateCreate extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: OfferDate['data'];
  };
  response: {
    status: 200;
    body: OfferDate['data'];
  };
}

export const offerDateCreateFactory: ApiCallFactory = (
  token: OfferDateCreate['request']['headers']['Authorization'],
  query: { offerId: string; date: OfferDate['data'] }
): OfferDateCreate => ({
  request: {
    route: apiRoutes.offerDateCreate({ offerId: query.offerId }),
    method: 'POST',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: query.date,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
