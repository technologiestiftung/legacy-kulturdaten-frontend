import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
import { Offer } from '../../types/offer';

/**
 * /auth/info
 */

export type OfferUpdate = ApiCall & {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'PATCH';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: Offer;
  };
  response: {
    status: 200;
    body: {
      data: Offer;
      meta: {
        message: 'Offer updated successfully';
      };
    };
  };
};

export const offerUpdateFactory = (
  token: OfferUpdate['request']['headers']['Authorization'],
  query: {
    id: string;
    offer: Offer;
  }
): OfferUpdate => ({
  request: {
    route: apiRoutes.offerUpdate({ id: query.id }),
    method: 'PATCH',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: query.offer,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
