import { fetchWithParams, getCMS } from './helper';
import { backendUrl } from '../../src/helpers/Api';

export const fetchHome = async (params) => {
  const data = await fetchWithParams(backendUrl('home'), params);
  return data;
};

export const fetchBanners = async (contentLanguages) => {
  const data = await getCMS('banner', { contentLanguages });
  return data;
};

