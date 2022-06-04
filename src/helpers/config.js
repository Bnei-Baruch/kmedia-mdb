class AppConfig {

  constructor() {
    this.kvmap = {};
  }

  cdnBase = () => this.kvmap['cdn_url'];
  publicBase = () => this.kvmap['public_base'];
  backendApi = () => this.kvmap['api_backend'];
  assetsApi = () => this.kvmap['assets_backend'];
  cmsApi = () => this.kvmap['cms_backend'];
  imaginaryApi = () => this.kvmap['imaginary_url'];
  imaginaryInternalHost = () => this.kvmap['imaginary_internal_host'];
  feedApi = () => this.kvmap['api_feed'];
  chroniclesApi = () => this.kvmap['chronicles_backend'];
  personalApi = () => this.kvmap['personal_api_backend'];
  fileTrimmerApi = () => this.kvmap['file_trimmer_api'];
  mdbRestApi = () => this.kvmap['mdb_rest_api_url'];

  chroniclesEnabled = () => this.chroniclesApi() !== undefined;
  isProductionBuild = () => this.kvmap['node_env'] === 'production';
  isBrowser = () => this.kvmap['is_browser'];

  load = kv => {
    this.kvmap = {
      ...kv,
      ...this.fromEnv(),
      'is_browser': (typeof window !== 'undefined' && window.document),
    };
  };

  // in local dev environments this is populated by react-scripts from .env files (or env vars)
  fromEnv = () => ({
    'cdn_url': process.env.REACT_APP_CDN_URL,
    'public_base': process.env.REACT_APP_PUBLIC_BASE,
    'api_backend': process.env.REACT_APP_API_BACKEND,
    'assets_backend': process.env.REACT_APP_ASSETS_BACKEND,
    'cms_backend': process.env.REACT_APP_CMS_BACKEND || `${process.env.REACT_APP_API_BACKEND}cms/`,
    'imaginary_url': process.env.REACT_APP_IMAGINARY_URL,
    'imaginary_internal_host': process.env.REACT_APP_IMAGINARY_INTERNAL_HOST || 'localhost',
    'api_feed': process.env.REACT_APP_FEED,
    'chronicles_backend': process.env.REACT_APP_CHRONICLES_BACKEND,
    'personal_api_backend': process.env.REACT_APP_PERSONAL_API_BACKEND,
    'file_trimmer_api': process.env.REACT_APP_FILE_TRIMMER_API,
    'mdb_rest_api_url': process.env.REACT_APP_MDB_REST_API_URL || `${process.env.REACT_APP_API_BACKEND}mdb-api/`,
    'node_env': process.env.NODE_ENV
  });

  dump = () => {
    console.log('AppConfig', this.kvmap);
  };
}

export default new AppConfig();
