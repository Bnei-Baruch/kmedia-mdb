import { imageSlice, selectors } from './imageSlice';
import { knownFallbackImages } from '@/src/helpers/images';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';

export const imageFetch = createAppAsyncThunk(
  'image/fetch',
  async (payload, thunkAPI) => {
    const { src } = payload;
    const state = thunkAPI.getState();

    const d = selectors.getBySrc(state.image, src);
    if (d?.src || d?.wip || d?.err) {
      return { src, img: d.src };
    }

    imageSlice.actions.startWIP(src);

    return await _fetch(payload);
  }
);

async function _fetch(payload) {
  const { src, fallbacks } = payload;

  let img;
  const arr = [src, ...fallbacks];

  for (const i in arr) {
    if (knownFallbackImages.includes(arr[i])) {
      img = arr[i];
      break;
    }
    try {
      img = await tryFetch(arr[i]);
      if (img) break;
    } catch (e) {
      console.log(src, e);
    }
  }

  if (img) {
    return { src, img };
  } else {
    throw Error(`cant load image ${src}`);
  }
}

async function tryFetch(src) {
  const promise = new Promise((resolve, reject) => {
    const displayImage   = new window.Image();
    displayImage.onerror = err => reject({ err });
    displayImage.onload  = r => resolve(src);

    displayImage.src = src;
  });

  return await promise;
}
