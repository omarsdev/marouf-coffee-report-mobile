import {buildQueryParams, HttpCall} from './HttpCall';

export const branchesAPI = {
  get: async (opt: any) => HttpCall('/branches' + buildQueryParams(opt)),
  getById: async (id: string) => HttpCall('/branches/' + id),
};
