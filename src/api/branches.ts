import {HttpCall} from './HttpCall';

export const branchesAPI = {
  get: async () => HttpCall('/branches'),
  getById: async (id: string) => HttpCall('/branches/' + id),
};
