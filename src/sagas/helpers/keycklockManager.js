import { actions } from '../../redux/modules/auth';

const KC_API = process.env.REACT_KC_API || 'https://raccounts.kab.info/auth';

//for SSR use empty functions
let login  = () => console.error('Must be override on browser, keycloak');
let logout = () => console.error('Must be override on browser, keycloak');

//because of keycloak-js module use windows on init we import it dynamic
let keycloak;

export const initKC = async (dispatch, language) => {
  //check is keycloak server is up
  try {
    const health = await fetch(`${KC_API}/realms/main/protocol/openid-connect/certs`);
    if (!health.ok) throw 'keycloak is not up';
  } catch (error) {
    console.error(error);
    dispatch(actions.loginFailure({ error }));
    return;
  }

  import('keycloak-js').then(({ default: Keycloak }) => {
    const userManagerConfig = {
      url: KC_API,
      realm: 'main',
      clientId: 'kmedia-public',
      scope: 'profile',
      enableLogging: true
    };
    keycloak                = new Keycloak(userManagerConfig);
    keycloak.onTokenExpired = () => renewToken(0);

    const renewToken = retry => {
      retry++;
      keycloak.updateToken(70).then(refreshed => {
        if (refreshed) {
          dispatch(actions.updateToken(keycloak.token));
        } else {
          renewRetry(retry, refreshed);
        }
      }).catch(err => {
        renewRetry(retry, err);
      });
    };

    const renewRetry = (retry, err) => {
      if (retry > 5) {
        keycloak.clearToken();
        dispatch(actions.loginFailure({ error: null }));
      } else {
        setTimeout(() => renewToken(retry), 10000);
      }
    };

    login = () => {
      keycloak.login({ redirectUri: window.location.href, locale: language });
    };

    logout = () => {
      keycloak.logout();
      actions.logoutSuccess();
    };

    const options = {
      checkLoginIframe: false,
      flow: 'standard',
      pkceMethod: 'S256',
      enableLogging: true,
      onLoad: 'check-sso'
    };

    return keycloak.init(options).then(ok => {
      if (!ok) {
        dispatch(actions.loginFailure(null));
        return;
      }

      const { sub, name } = keycloak.tokenParsed;
      dispatch(actions.loginSuccess({ user: { id: sub, name }, token: keycloak.token }));
    }).catch(error => {
      dispatch(actions.loginFailure({ error }));
    });
  });
};

export const kc = function () {
  return { login, logout };
};
