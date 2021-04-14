export enum Routes {
  index = 'index',
  login = 'login',
  register = 'register',
  userProfile = 'userProfile',
}

export const routes: { [key in Routes]: string } = {
  index: '/',
  userProfile: '/user/profile/',
  login: '/auth/login/',
  register: '/auth/register/',
};
