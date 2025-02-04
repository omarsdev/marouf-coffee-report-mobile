import {buildQueryParams, HttpCall} from './HttpCall';

export const ticketsAPI = {
  get: async (query: any) => {
    return HttpCall('/tickets' + buildQueryParams(query));
  },
  create: async (body: any) => HttpCall('/tickets', 'POST', body),
};
