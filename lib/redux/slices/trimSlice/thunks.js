import Api from '../../../../src/helpers/Api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const trim = createAsyncThunk(
  'trim/trim',
  async (params) => {
    const { data } = await Api.trimFile(params);
    return  data;
  }
);
