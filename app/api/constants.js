
const API_BACKEND             = process.env.NEXT_PUBLIC_API_BACKEND;
const ASSETS_BACKEND          = process.env.NEXT_PUBLIC_ASSETS_BACKEND;
const CMS_BACKEND             = process.env.NEXT_PUBLIC_CMS_BACKEND || `${API_BACKEND}cms/`;
export const IMAGINARY_URL    = process.env.NEXT_PUBLIC_IMAGINARY_URL;
export const IMAGINARY_INTERNAL_HOST = process.env.NEXT_PUBLIC_IMAGINARY_INTERNAL_HOST || 'localhost';
const API_FEED                = process.env.NEXT_PUBLIC_FEED;
const CHRONICLES_BACKEND      = process.env.NEXT_PUBLIC_CHRONICLES_BACKEND;
const PERSONAL_API_BACKEND    = process.env.NEXT_PUBLIC_PERSONAL_API_BACKEND;
const FILE_TRIMMER_API        = process.env.NEXT_PUBLIC_FILE_TRIMMER_API;
const MDB_REST_API_URL        = process.env.NEXT_PUBLIC_MDB_REST_API_URL || `${API_BACKEND}mdb-api/`;

export const backendUrl               = path => {
  return `${API_BACKEND}${path}`;
};
export const assetUrl                 = path => `${ASSETS_BACKEND}${path}`;
export const cmsUrl                   = path => `${CMS_BACKEND}${path}`;
export const cLogoUrl                 = path => `${cmsUrl('images/logos/' + path)}`;
export const imaginaryUrl             = path => `${IMAGINARY_URL}${path}`;
export const feedUrl                  = path => `${API_FEED}${path}`;
export const chroniclesUrl            = path => `${CHRONICLES_BACKEND}${path}`;
export const chroniclesBackendEnabled = CHRONICLES_BACKEND !== undefined;
