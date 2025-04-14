import axios from 'axios';

import useAuthStore from '@/store/useAuth';
import {showMessage} from 'react-native-flash-message';
import useDateStore from '@/store/useDateStore';

const PRODUCTION_API = 'https://marouf-ticket-ac294cbae16f.herokuapp.com/api';
const STAGING_API = 'https://stg-marouf-ticket-c3fae247ad08.herokuapp.com/api';

export const baseURL = PRODUCTION_API;

let axiosInstance;

const createAxiosInstance = async () => {
  axiosInstance = axios.create({
    baseURL,
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
        useDateStore.getState().resetDateStore();
      }
      console.error(error?.response?.data);
      showMessage({
        message:
          typeof error?.response?.data === 'string'
            ? error?.response?.data
            : typeof error?.response?.data?.message === 'string'
            ? error?.response?.data?.message
            : typeof error?.response?.data?.error === 'string'
            ? error?.response?.data?.error
            : 'An Error occurred',
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
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))
          .replace(/%2C/g, ',')
          .replace(/%2F/g, '/')}`, // Prevents encoding `/` as `%2F`
    )
    .join('&');

  return queryParams ? `?${queryParams}` : '';
};
