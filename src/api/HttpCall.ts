import axios from 'axios';

import useAuthStore from '@/store/useAuth';
import {showMessage} from 'react-native-flash-message';

let axiosInstance;

const createAxiosInstance = async () => {
  axiosInstance = axios.create({
    baseURL: 'https://maroufticket-9bb3c74b4061.herokuapp.com/api/',
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    config.headers['Content-Type'] = 'application/json';

    return config;
  });

  axiosInstance.interceptors.response.use(
    response => Promise.resolve(response.data),
    error => {
      if (error?.response?.status === 411) {
        useAuthStore.getState().resetAuthStore();
      }
      console.error(error?.response?.data);
      showMessage({
        message:
          typeof error?.response?.data === 'string'
            ? error?.response?.data
            : error?.response?.data?.message,
        type: 'danger',
      });
      return Promise.reject(
        error.response ? error.response.data : error.message,
      );
    },
  );
};

createAxiosInstance();

export const HttpCall = async (
  url: string,
  method = 'GET',
  data = {},
  headers = {},
) => {
  try {
    const response = await axiosInstance({
      url,
      method,
      data: method !== 'GET' ? data : undefined,
      headers: {...headers},
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const buildQueryParams = paramsObject => {
  const queryParams = Object.entries(paramsObject)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&');

  return queryParams ? `?${queryParams}` : '';
};
