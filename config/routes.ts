import { Route } from '../lib/routing';

export enum Routes {
  index = 'index',
  dashboard = 'dashboard',
  login = 'login',
  register = 'register',
  userProfile = 'userProfile',
  providers = 'providers',
  provider = 'provider',
}

export const routes: { [key in Routes]: Route } = {
  index: () => '/',
  dashboard: () => '/app/',
  userProfile: () => '/app/user/profile/',
  login: () => '/app/auth/login/',
  register: () => '/app/auth/register/',
  providers: () => '/app/providers/',
  provider: (query?: { entry: string }) => `${routes.providers()}${query?.entry}/`,
};
