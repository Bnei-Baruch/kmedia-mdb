import Api from '../../../../src/helpers/Api';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';

export const trim = createAppAsyncThunk(
  'tags/fetch',
  async (params) => {
    const { data } = await Api.trimFile(params);
    return  data;
  }
);
