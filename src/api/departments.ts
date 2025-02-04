import {buildQueryParams, HttpCall} from './HttpCall';

export const departmentsAPI = {
  get: async () => HttpCall('/departments'),
};
