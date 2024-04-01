import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BACKEND } from '../../helpers/Api';

export const backendApi = createApi({
  reducerPath      : 'backendApi',
  keepUnusedDataFor: 10, // seconds; If user will click the "Back" button in 10 sec (or will return to prev parameters in any other way) - the result will still be in cache
  baseQuery        : fetchBaseQuery({
    baseUrl: API_BACKEND
  }),
  // Real endpoints are injected in api files
  endpoints        : builder => ({})
});

