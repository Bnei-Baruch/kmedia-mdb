import { CHRONICLES_BACKEND } from '../../helpers/Api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chroniclesApi = createApi({
  reducerPath: 'chroniclesApi',
  baseQuery  : fetchBaseQuery({
    baseUrl: CHRONICLES_BACKEND
  }),
  endpoints  : builder => ({
    appends: builder.mutation({
      query: data => ({
        url   : '/appends',
        method: 'POST',
        body  : data
      })
    })
  })
});
