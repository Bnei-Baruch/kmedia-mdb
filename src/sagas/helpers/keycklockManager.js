import { actions } from '../../redux/modules/auth';

//for SSR use empty functions
let login  = () => console.error('Must be override on browser, keycloak');
let logout = () => console.error('Must be override on browser, keycloak');

//because of keycloak-js module use windows on init we import it dynamic
let keycloak;

//demi authentication
/*
export const initKC_ = (dispatch) => {
  dispatch(actions.loginSuccess({ user: { id: 'token.Subject', name: 'test_name' }, token: 'token.Subject' }));
};
*/

export const initKC = (dispatch, language) => {
  import('keycloak-js').then(({ default: Keycloak }) => {
    const userManagerConfig = {
      url: 'https://accounts.kab.info/auth',
      realm: 'main',
      clientId: 'kmedia-public',
      scope: 'profile',
      enableLogging: true
    };
    keycloak                = new Keycloak(userManagerConfig);
    keycloak.onTokenExpired = () => renewToken(0);

    const renewToken = (retry) => {
      retry++;
      keycloak.updateToken(70).then((refreshed) => {
        if (refreshed) {
          dispatch(actions.updateToken(keycloak.token));
        } else {
          renewRetry(retry, refreshed);
        }
      }).catch((err) => {
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

    login = () => keycloak.login({ redirectUri: window.location.href, locale: language });

    logout = () => {
      keycloak.logout();
      actions.logoutSuccess();
    };

    const options = {
      checkLoginIframe: false,
      flow: 'standard',
      pkceMethod: 'S256',
      enableLogging: true,
    };

    //if initial on return from KC server
    const isBack = (window.location.hash.includes('state') && window.location.hash.includes('session_state'));
    if (!isBack) options.onLoad = 'check-sso';

    return keycloak.init(options).then((ok) => {
      if (!ok && !isBack) return;

      if (!ok && isBack) {
        login().then(v => {
          const { sub, name } = keycloak.tokenParsed;
          dispatch(actions.loginSuccess({ user: { id: sub, name }, token: keycloak.token }));
        });
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
