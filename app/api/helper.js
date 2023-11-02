const IMAGINARY_INTERNAL_HOST = process.env.NEXT_PUBLIC_IMAGINARY_INTERNAL_HOST || 'localhost';

import { cmsUrl, Requests, backendUrl, imaginaryUrl, assetUrl } from '../../src/helpers/Api';

export const imaginary = (params) => {
  if (!params.url.startsWith('http')) {
    params.url = `http://${IMAGINARY_INTERNAL_HOST}${params.url}`;
  }

  return `${imaginaryUrl('thumbnail')}?${Requests.makeParams(params)}`;
};
export const sqdata    = async (params) => await fetchWithParams(backendUrl('sqdata'), params);

export const getCMS = async (item, { id, ...params }) => {
  let url;
  switch (item) {
    case 'banner':
      url = cmsUrl('banners-list');
      break;
    case 'person':
      url = `${cmsUrl('persons')}/${id}`;
      break;
    default:
      return null;
  }

  return await fetchWithParams(url, params);
};
export const getAsset = path => fetchWithParams(assetUrl(path));

export const fetchWithParams = async (url, params) => {
  const res = await fetch(`${url}?${makeParams(params)}`);
  return res.json();
};

const makeParams = params => (
  Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(pair => {
      const key   = pair[0];
      const value = pair[1];

      if (Array.isArray(value)) {
        return value.map(val => `${key}=${Requests.encode(val)}`).join('&');
      }

      return `${key}=${Requests.encode(value)}`;
    })
    //can happen if parameter value is empty array
    .filter(p => p !== '')
    .join('&').toString()
);
