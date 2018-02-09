import { RTL_LANGUAGES } from '../helpers/consts';

export const getCurrentDirection = () => {
  if (typeof window === 'undefined') {
    return;
  }

  return document.getElementById('root').style.getPropertyValue('direction');
};

export const changeDirection = (direction) => {
  if (typeof window === 'undefined') {
    return;
  }

  const isRTL = direction === 'rtl';

  // replace semantic-ui css
  const oldlink = document.getElementById('semantic-ui');
  const newlink = document.createElement('link');
  newlink.setAttribute('rel', 'stylesheet');
  newlink.setAttribute('type', 'text/css');
  newlink.setAttribute('id', 'semantic-ui');
  newlink.setAttribute('href', `/semantic${isRTL ? '.rtl' : ''}.min.css`);
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

export const getLanguageDirection = language => RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
