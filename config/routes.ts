export type Route = (params?: { [key: string]: string }) => string;

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
  dashboard: () => '/app',
  userProfile: () => '/app/user/profile',
  login: () => '/app/auth/login',
  register: () => '/app/auth/register',
  providers: () => '/app/providers',
  provider: ({ id }: { id: string }) => `${routes.providers()}/${id}`,
};
