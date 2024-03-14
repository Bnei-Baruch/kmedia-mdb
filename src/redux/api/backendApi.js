import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BACKEND } from '../../helpers/Api';

export const backendApi = createApi({
  reducerPath: 'backendApi',
  keepUnusedDataFor: 10,
  baseQuery: fetchBaseQuery({
    baseUrl: API_BACKEND
  }),
  endpoints: builder => ({})
});

