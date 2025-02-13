import useAuthStore from '@/store/useAuth';
import {buildQueryParams, HttpCall} from './HttpCall';

export const branchesAPI = {
  get: async () =>
    HttpCall(
      '/branches' +
        buildQueryParams({area_manager: useAuthStore.getState()?.user?._id}),
    ),
  getById: async (id: string) => HttpCall('/branches/' + id),
};
