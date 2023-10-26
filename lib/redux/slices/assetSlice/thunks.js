import Api from '../../../../src/helpers/Api';
import { fetchUnit } from '@/lib/redux/slices/mdbSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const unzip = createAsyncThunk(
  'assets/unzip',
  async (payload) => {
    const id = payload;

    const { data } = await Api.getAsset(`api/unzip/${id}`);
    return { id, data };
  }
);

export const unzipList = createAsyncThunk(
  'assets/unzipList',
  async (payload) => {
    const ids = payload;

    const { data } = await Api.getUnzipUIDs({ path: 'api/unzip_uids', ids });
    return { ids, data };
  }
);

export const doc2Html = createAsyncThunk(
  'assets/doc2Html',
  async (payload) => {
    const id = payload;

    const { data } = await Api.getAsset(`api/doc2html/${id}`);
    return { id, data };
  }
);

export const fetchSource = createAsyncThunk(
  'assets/sourceIndex',
  async (payload, thunkAPI) => {
    let id = payload;
    if (/^gr-/.test(id)) { // Rabash Group Articles
      const result = /^gr-(.+)/.exec(id);
      id           = result[1];
    }

    const cu = await thunkAPI.dispatch(fetchUnit(id));
    return { id, data: cuFilesToData(cu.payload.data) };
  }
);

function cuFilesToData(cu) {
  return !cu.files ? {} : cu.files.reduce((acc, f) => {
    const { language, name } = f;
    if (!acc[language])
      acc[language] = {};

    const ext          = name.split('.').slice(-1);
    acc[language][ext] = f;
    return acc;
  }, {});
}

export const fetchAsset = createAsyncThunk(
  'assets/fetchAsset',
  async (payload) => {
    let id = payload;
    if (/^gr-/.test(id)) { // Rabash Group Articles
      const result = /^gr-(.+)/.exec(id);
      id           = result[1];
    }

    const { data } = await Api.getAsset(payload);
    return data;
  }
);

export const fetchPerson = createAsyncThunk(
  'assets/fetchPerson',
  async (payload) => {

    const { data } = await Api.getCMS('person', {
      contentLanguages: payload.contentLanguages,
      id: payload.sourceId,
    });
    return data;
  }
);

export const fetchTimeCode = createAsyncThunk(
  'assets/fetchTimeCode',
  async (payload) => {

    const { uid, language } = payload;
    const { data }          = await Api.getAsset(`api/time_code?uid=${uid}&language=${language}`);
    return data;
  }
);

export const mergeKiteiMakor = createAsyncThunk(
  'assets/mergeKiteiMakor',
  async (payload) => {
    const { id, lang } = payload;
    const { data }     = await Api.getAsset(`api/km_audio/build/${id}?language=${lang}`);
    return { id, lang, status: data };
  }
);

