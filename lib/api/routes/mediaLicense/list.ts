import { apiRoutes, ApiCall, ApiRoute, ApiCallFactory } from '../..';
import { MediaLicense } from '../../types/media';

/**
 * /mediaLicense/
 */

export interface MediaLicenseList extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'GET';
  };
  response: {
    status: 200;
    body: {
      data: MediaLicense[];
    };
  };
}

export const mediaLicenseListFactory: ApiCallFactory = (): MediaLicenseList => ({
  request: {
    route: apiRoutes.mediaLicenseList(),
    method: 'GET',
  },
  response: {
    status: 200,
    body: undefined,
  },
});
