import {HttpCall} from './HttpCall';

export const reportsAPI = {
  get: async (userId: string) => HttpCall('/reports/users/', userId),
};
