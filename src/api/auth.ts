import {HttpCall} from './HttpCall';

export const authAPI = {
  login: async (body: any) => HttpCall('/auth', 'POST', body),
};
