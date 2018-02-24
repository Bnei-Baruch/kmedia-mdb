import { DEFAULT_LANGUAGE } from './consts';
import { getCookie } from './utils';

export const getCurrentDirection = () =>
  document.getElementById('root').style.getPropertyValue('direction');

export const changeDirection = (direction) => {
  const isRTL = direction === 'rtl';

  // replace semantic-ui css
  const oldlink = document.getElementById('semantic-ui');
  const newlink = document.createElement('link');
  newlink.setAttribute('rel', 'stylesheet');
  newlink.setAttribute('type', 'text/css');
  newlink.setAttribute('id', 'semantic-ui');
  newlink.setAttribute('href', `/semantic_v2${isRTL ? '.rtl' : ''}.min.css`);
  document.getElementsByTagName('head').item(0).replaceChild(newlink, oldlink);

  // change root element direction
  const root = document.getElementById('root');
  root.setAttribute('style', `direction: ${direction};`);
  if (isRTL) {
    root.classList.add('rtl');
  } else {
    root.classList.remove('rtl');
  }
};


const lngLookup = () => {
  const localStoregeLng = localStorage.getItem('i18nextLng');

  if (localStoregeLng) {
    return localStoregeLng;
  }

  const cookieLng    = getCookie('i18nextLng');
  const navigatorLng = window.navigator.languages[0];

  return cookieLng || navigatorLng;
};

export const initialLng = () => {
  let lng = lngLookup();

  if (lng.length > 2) {
    [lng] = lng.split('-');
  }

  return lng;
};
