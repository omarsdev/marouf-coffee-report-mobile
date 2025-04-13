import {buildQueryParams, HttpCall} from './HttpCall';

export const ticketsAPI = {
  get: async (query: any) => {
    return HttpCall('/tickets' + buildQueryParams(query));
  },
  getById: async (ticketId: string) => {
    return HttpCall('/tickets/' + ticketId);
  },
  create: async (body: any) => HttpCall('/tickets', 'POST', body),
  updateStatus: async (id: number, status: number) =>
    HttpCall(`/tickets/${id}`, 'PUT', {status}),
  update: async (id: number, body: any) =>
    HttpCall(`/tickets/${id}`, 'PUT', body),
  transferStatus: async (id: number, body: any) =>
    HttpCall(`/tickets/update/${id}`, 'PUT', body),
};
