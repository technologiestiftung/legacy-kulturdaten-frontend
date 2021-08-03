import { apiRoutes, makeBearer, ApiCall, ApiRoute, ApiCallFactory } from '../..';
import { Offer, CreateOffer } from '../../types/offer';

/**
 * /auth/info
 */

export interface OfferCreate extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: CreateOffer;
  };
  response: {
    status: 200;
    body: Offer;
  };
}

export const offerCreateFactory: ApiCallFactory = (
  token: OfferCreate['request']['headers']['Authorization'],
  query: { entry: CreateOffer }
): OfferCreate => ({
  request: {
    route: apiRoutes.offerCreate(),
    method: 'POST',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: query.entry,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
