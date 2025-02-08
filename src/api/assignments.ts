import {HttpCall, buildQueryParams} from './HttpCall';

export const assignmentsAPI = {
  get: async (query: any) => {
    return HttpCall('/assignments/me' + buildQueryParams(query));
  },
  getById: async (assignmentId: string) => {
    return HttpCall('/assignments/' + assignmentId);
  },
};
