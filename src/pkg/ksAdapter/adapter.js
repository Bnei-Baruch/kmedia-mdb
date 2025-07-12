// Remove the static import
// import Keycloak from 'keycloak-js';

// This file used loaded in SSR and in client side too.
// Try load the constants from process and in client expect them in window global object.
const KC_API_URL   = process.env.REACT_KC_API_URL || (typeof window !== 'undefined' && window.KC_API_URL) || 'https://accounts.kab.info/auth';
const KC_REALM     = process.env.REACT_KC_REALM || (typeof window !== 'undefined' && window.KC_REALM) || 'main';
const KC_CLIENT_ID = process.env.REACT_KC_CLIENT_ID || (typeof window !== 'undefined' && window.KC_CLIENT_ID) || 'kmedia-public';

export const KC_API_WITH_REALM = `${KC_API_URL}/realms/${KC_REALM}`;

export const KC_SEARCH_KEY_SESSION = 'session_state';
export const KC_SEARCH_KEY_STATE   = 'state';
export const KC_SEARCH_KEY_CODE    = 'code';
export const KC_SEARCH_KEYS        = [KC_SEARCH_KEY_SESSION, KC_SEARCH_KEY_STATE, KC_SEARCH_KEY_CODE];

export const KC_UPDATE_USER  = 'KC_UPDATE_USER';
export const KC_UPDATE_TOKEN = 'KC_UPDATE_TOKEN';

// Dynamic import for keycloak
let keycloak = null;
let keycloakPromise = null;

const getKeycloak = async () => {
  if (keycloak) {
    return keycloak;
  }
  
  if (keycloakPromise) {
    return keycloakPromise;
  }
  
  if (typeof window === 'undefined') {
    return {};
  }
  
  keycloakPromise = import('keycloak-js').then(({ default: Keycloak }) => {
    const userManagerConfig = {
      url          : KC_API_URL,
      realm        : KC_REALM,
      clientId     : KC_CLIENT_ID,
      enableLogging: true
    };
    
    keycloak = new Keycloak(userManagerConfig);
    
    keycloak.onTokenExpired = () => {
      renewRetry(0);
    };
    
    return keycloak;
  }).catch(error => {
    console.error('Failed to load keycloak-js:', error);
    return {};
  });
  
  return keycloakPromise;
};

export const login = async () => {
  const url = new URL(window.location.href);
  url.searchParams.set('authorised', 'true');
  try {
    await healthCheckKC();
  } catch (e) {
    alert('Keycloak server is down');
    return;
  }

  const kc = await getKeycloak();
  if (!kc.login) return;
  
  kc.login({ redirectUri: url.href })
    .then(r => {
      updateUser(r);
    })
    .catch(() => updateUser(null));
};

export const logout = async () => {
  const kc = await getKeycloak();
  if (!kc.logout) return;
  
  kc.logout()
    .then(() => updateUser(null))
    .catch(err => {
      console.error('Logout failed:', err);
      updateUser(null);
    });
};

export const initKC = async () => {
  try {
    await healthCheckKC();

  } catch (e) {
    return { user: null };
  }

  const kc = await getKeycloak();
  if (!kc.init) {
    return { user: null };
  }

  const options   = {
    checkLoginIframe: false,
    flow            : 'standard',
    pkceMethod      : 'S256',
    enableLogging   : true,
    onLoad          : 'check-sso'
  };
  document.cookie = 'authorised=true;max-age=10';
  const resp      = { user: null, token: null };
  return kc.init(options).then(ok => {
    if (!ok) {
      return resp;
    }

    const { sub, name } = kc.tokenParsed;
    resp.user           = { id: sub, name };
    resp.token          = kc.token;
    return resp;
  }).catch(error => {
    console.error('Keycloak init error:', error);
    return resp;
  });
};

const updateUser = user => {
  const ev = new CustomEvent(KC_UPDATE_USER, { detail: user });
  window.dispatchEvent(ev);
};

const updateToken = token => {
  const ev = new CustomEvent(KC_UPDATE_TOKEN, { detail: token });
  window.dispatchEvent(ev);
};

const renewRetry = (retry, err) => {
  if (retry > 5) {
    getKeycloak().then(kc => {
      if (kc.clearToken) {
        kc.clearToken();
      }
      updateUser(null);
    });
  } else {
    setTimeout(() => renewToken(retry), 10000);
  }
};

const renewToken = retry => {
  retry++;
  getKeycloak().then(kc => {
    if (!kc.updateToken) return;
    
    kc.updateToken(70).then(refreshed => {
      if (refreshed) {
        updateToken(kc.token);
      } else {
        renewRetry(retry, refreshed);
      }
    }).catch(err => {
      console.error('Token renewal failed:', err);
      renewRetry(retry, err);
    });
  });
};

export const kcUpdateToken = async () => {
  const kc = await getKeycloak();
  if (!kc.updateToken) return null;
  
  return kc.updateToken(70)
    .then(ok => {
      if (ok) updateToken(kc.token);
      return kc.token;
    });
};

const healthCheckKC = async () => {
  const health = await fetch(`${KC_API_WITH_REALM}/protocol/openid-connect/certs`, { cache: 'no-store' })
    .then(resp => {
      if (resp.status >= 400) {
        throw new Error('keycloak server return bad response');
      }

      return resp;
    })
    .catch(err => {
      console.log(err.response.data);
    });
  if (!health.ok) {
    throw Error('keycloak server is down');
  }
};
