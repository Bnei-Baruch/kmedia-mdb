import Api from '../../../../src/helpers/Api';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';

export const unzip = createAppAsyncThunk(
  'assets/unzip',
  async (payload) => {
    const id = payload;

    const { data } = await Api.getAsset(`api/unzip/${id}`);
    return { id, data };
  }
);

export const unzipList = createAppAsyncThunk(
  'assets/unzipList',
  async (payload) => {
    const id = payload;

    const { data } = await Api.getUnzipUIDs({ path: 'api/unzip_uids', ids });
    return { id, data };
  }
);

export const doc2Html = createAppAsyncThunk(
  'assets/doc2Html',
  async (payload) => {
    const id = payload;

    const { data } = await Api.getAsset(`api/doc2html/${id}`);
    return { id, data };
  }
);

export const sourceIndex = createAppAsyncThunk(
  'assets/sourceIndex',
  async (payload) => {
    let id = payload;
    if (/^gr-/.test(id)) { // Rabash Group Articles
      const result = /^gr-(.+)/.exec(id);
      id           = result[1];
    }

    const cu = await Api.unit({ id });
    return { id, data: cuFilesToData(cu.data) };
  }
);

export const fetchAsset = createAppAsyncThunk(
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

export const fetchPerson = createAppAsyncThunk(
  'assets/fetchPerson',
  async (payload) => {

    const { data } = await Api.getCMS('person', {
      contentLanguages: payload.contentLanguages,
      id: payload.sourceId,
    });
    return data;
  }
);

export const fetchTimeCode = createAppAsyncThunk(
  'assets/fetchTimeCode',
  async (payload) => {

    const { uid, language } = payload;
    const { data }          = await Api.getAsset(`api/time_code?uid=${uid}&language=${language}`);
    return data;
  }
);

export const mergeKiteiMakor = createAppAsyncThunk(
  'assets/mergeKiteiMakor',
  async (payload) => {
    const { id, lang } = payload;
    const { data }     = await Api.getAsset(`api/km_audio/build/${id}?language=${lang}`);
    return { id, lang, status: data };
  }
);
