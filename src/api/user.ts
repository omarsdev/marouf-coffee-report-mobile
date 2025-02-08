import axios from 'axios';
import {HttpCall} from './HttpCall';
import useAuthStore from '@/store/useAuth';

export const userAPI = {
  me: async (token?: string) =>
    HttpCall(
      '/users/me',
      'GET',
      {},
      token && {
        'x-auth-token': token,
      },
    ),
  postImage: async (body: any) =>
    axios.post(
      'https://maroufticket-9bb3c74b4061.herokuapp.com/api/users/upload_image',
      body,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          'x-auth-token': useAuthStore.getState().token,
        },
      },
    ),
  areaManagers: async () => HttpCall('/users/area_manager'),
};
