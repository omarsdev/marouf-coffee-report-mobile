import {HttpCall} from './HttpCall';

export const submissionsAPI = {
  create: async (body: any) => HttpCall('/submissions', 'POST', body),
  getByReportId: async (reportId: string) =>
    HttpCall('/submissions/report/' + reportId),
};
