import Keycloak from 'keycloak-js';

export const KC_API = process.env.REACT_KC_API_URL || 'https://accounts.kab.info/auth';

export const KC_SEARCH_KEY_SESSION = 'session_state';
export const KC_SEARCH_KEY_STATE   = 'state';
export const KC_SEARCH_KEY_CODE    = 'code';
export const KC_SEARCH_KEYS        = [KC_SEARCH_KEY_SESSION, KC_SEARCH_KEY_STATE, KC_SEARCH_KEY_CODE];

export const KC_UPDATE_USER  = 'KC_UPDATE_USER';
export const KC_UPDATE_TOKEN = 'KC_UPDATE_TOKEN';

export const login = () => {
  keycloak.login()
    .then(r => updateUser(r))
    .catch(() => updateUser(null));
};

export const logout = () => {
  keycloak.logout().then(() => updateUser(null));
};

export const initKC = async () => {
  try {
    await healthCheckKC();
  } catch (e) {
    return null;
  }

  const options   = {
    checkLoginIframe: false,
    flow: 'standard',
    pkceMethod: 'S256',
    enableLogging: true,
    onLoad: 'check-sso'
  };
  document.cookie = 'authorised=true;max-age=1';
  const resp      = { user: null, token: null };
  return keycloak.init(options).then(ok => {
    if (!ok) {
      return resp;
    }

    const { sub, name } = keycloak.tokenParsed;
    resp.user           = { id: sub, name };
    resp.token          = keycloak.token;
    return resp;
  }).catch(error => {
    console.error(error);
    return resp;
  });
};

const updateUser  = (user) => {
  const ev = new CustomEvent(KC_UPDATE_USER, { detail: user });
  window.dispatchEvent(ev);
};
const updateToken = (token) => {
  const ev = new CustomEvent(KC_UPDATE_TOKEN, { detail: token });
  window.dispatchEvent(ev);
};

const userManagerConfig = {
  url: KC_API,
  realm: 'main',
  clientId: 'kmedia-public',
  scope: 'profile',
  enableLogging: true
};
const keycloak          = typeof window !== 'undefined' ? new Keycloak(userManagerConfig) : {};

const renewRetry    = (retry, err) => {
  if (retry > 5) {
    keycloak.clearToken();
    updateUser(null);
  } else {
    setTimeout(() => renewToken(retry), 10000);
  }
};
const renewToken    = retry => {
  retry++;
  keycloak.updateToken(70).then(refreshed => {
    if (refreshed) {
      updateToken(keycloak.token);
    } else {
      renewRetry(retry, refreshed);
    }
  }).catch(err => {
    renewRetry(retry, err);
  });
};
const healthCheckKC = async () => {
  const health = await fetch(`${KC_API}/realms/main/protocol/openid-connect/certs`);
  if (!health.ok) {
    throw Error('keycloak server is down');
  }
};
