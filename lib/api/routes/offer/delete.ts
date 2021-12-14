import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
import { Offer } from '../../types/offer';

/**
 * /offer
 */

export interface OfferDelete extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'DELETE';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: Offer['data'];
  };
  response: {
    status: 200;
    body: {
      data: null;
      meta: {
        message: 'Offer deleted successfully';
      };
    };
  };
}

export const offerDeleteFactory = (
  token: OfferDelete['request']['headers']['Authorization'],
  query: { id: string; entry: Offer['data'] }
): OfferDelete => ({
  request: {
    route: apiRoutes.offerDelete({ id: query.id }),
    method: 'DELETE',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: query?.entry,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
