import { Log as oidclog, WebStorageStateStore } from 'oidc-client';
import { createUserManager } from 'redux-oidc';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const AUTH_URL = process.env.REACT_APP_AUTH_URL;

oidclog.logger = console;
oidclog.level  = 4;

// TODO(yanive): revise this to work server side as well.

const userManagerConfig = {
  client_id: 'mdb-admin-ui',
  redirect_uri: `${BASE_URL}callback`,
  response_type: 'token id_token',
  scope: 'openid profile',
  authority: AUTH_URL,
  post_logout_redirect_uri: BASE_URL,
  automaticSilentRenew: true,
  silent_redirect_uri: `${BASE_URL}silent_renew.html`,

  userStore: new WebStorageStateStore({ store: localStorage }),
};

export default createUserManager(userManagerConfig);
