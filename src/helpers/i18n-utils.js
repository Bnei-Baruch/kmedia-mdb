import { RTL_LANGUAGES } from '../helpers/consts';

export const getCurrentDirection = () => {
  const el = document.getElementById('root');
  //check if it's first load
  if (el.getAttribute('rel') !== 'stylesheet') {
    return null;
  }
  return el.style.getPropertyValue('direction') || 'ltr';
};

export const changeDirectionIfNeeded = (language) => {
  const currentDirection = getCurrentDirection();
  const newDirection     = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';

  if (currentDirection !== newDirection) {
    changeDirection(newDirection);
  }
};

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
