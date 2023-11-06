import { IMAGINARY_INTERNAL_HOST, imaginaryUrl } from './constants';
import { makeParams } from './helper';

export const imaginary = (action, params) => {
  if (!params.url.startsWith('http')) {
    params.url = `http://${IMAGINARY_INTERNAL_HOST}${params.url}`;
  }

  return `${imaginaryUrl('thumbnail')}?${makeParams(params)}`;
};
