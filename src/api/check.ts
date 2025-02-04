import {HttpCall} from './HttpCall';

export const checkAPI = {
  in: async (body: any) => HttpCall('/checks/check_in', 'POST', body),
  out: async (branch: any) =>
    HttpCall('/checks/check_out', 'POST', {
      branch,
    }),
};
