import {HttpCall} from './HttpCall';

export const userAPI = {
  me: async (token?: string) =>
    HttpCall(
      '/users/me',
      'GET',
      {},
      token && {
        'x-auth-token': token,
      },
    ),
};
