import { VS_FHD, VS_NHD, VS_HD, MT_AUDIO } from '../../../../helpers/consts';

const SIZE_BY_QUALITY      = {
  [VS_FHD]: 4 * 1000 * 1000,
  [VS_HD]: 1.5 * 1000 * 1000,
  [VS_NHD]: 600 * 1000,
  [MT_AUDIO]: 64 * 1000
};
export const sizeByQuality = (quality, duration) => SIZE_BY_QUALITY[quality] * duration;
