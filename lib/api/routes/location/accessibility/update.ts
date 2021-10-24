import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../../..';
import { Accessibility } from '../../../types/accessibility';

/**
 * /location/accessibility/update
 */

export type LocationAccessibilityUpdate = ApiCall & {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'PATCH';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: Accessibility;
  };
  response: {
    status: 200;
    body: {
      data: Location;
      meta: {
        message: 'Location Accessibility updated successfully';
      };
    };
  };
};

export const locationAccessibilityUpdateFactory = (
  token: LocationAccessibilityUpdate['request']['headers']['Authorization'],
  query: {
    id: string;
    entry: Accessibility;
  }
): LocationAccessibilityUpdate => ({
  request: {
    route: apiRoutes.locationAccessibilityUpdate({ id: query.id }),
    method: 'PATCH',
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
