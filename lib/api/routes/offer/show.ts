import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
import { Offer } from '../../types/offer';

/**
 * /auth/info
 */

export interface OfferShow extends ApiCall {
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
      data: Offer;
    };
  };
}

export const offerShowFactory = (
  token: OfferShow['request']['headers']['Authorization'],
  query: { id: string }
): OfferShow => ({
  request: {
    route: apiRoutes.offerShow({ id: query.id }),
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
