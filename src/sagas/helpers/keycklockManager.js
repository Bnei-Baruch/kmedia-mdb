import { actions } from '../../redux/modules/auth';

//for SSR use empty functions
let login  = () => console.error('Must be override on browser, keycloak');
let logout = () => console.error('Must be override on browser, keycloak');

//because of keycloak-js module use windows on init we import it dynamic
let keycloak;

export const initKC = (dispatch) => {
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
        dispatch(actions.loginFailure());
      } else {
        setTimeout(() => renewToken(retry), 10000);
      }
    };
    return keycloak.init({
      //onLoad: 'check-sso',
     // checkLoginIframe: true,
      flow: 'standard',
      pkceMethod: 'S256',
    }).then((ok) => {
      if (!ok) return;
      const { sub, name } = keycloak.tokenParsed;
      dispatch(actions.loginSuccess({ user: { id: sub, name }, token: keycloak.token }));
    });
  });
};
if (typeof window !== 'undefined') {

  login = () => keycloak.login({ redirectUri: window.location.href/*, locale: kcLocale(this.props.i18n.language)*/ });

  logout = () => {
    keycloak.logout();
    actions.logoutSuccess();
  };
}

export const kc = function () {
  return { login, logout };
};
