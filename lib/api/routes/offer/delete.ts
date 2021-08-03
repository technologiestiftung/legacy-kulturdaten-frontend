import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';

/**
 * /auth/info
 */

export interface OfferDelete extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'DELETE';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: null;
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
  query: { id: string }
): OfferDelete => ({
  request: {
    route: apiRoutes.offerDelete({ id: query.id }),
    method: 'DELETE',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: null,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
