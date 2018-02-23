import { RTL_LANGUAGES } from '../helpers/consts';

export const changeDirectionIfNeeded = (language) => {
  const el               = document.getElementById('root');
  const currentDirection = el.style.getPropertyValue('direction');
  const newDirection     = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';

  if (currentDirection !== newDirection || (currentDirection === 'rtl' && el.getAttribute('rel') === 'preload')) {
    changeDirection(newDirection);
  } else {
    el.setAttribute('rel', 'stylesheet');
  }
};

const changeDirection = (direction) => {
  const isRTL = direction === 'rtl';

  // replace semantic-ui css
  const el = document.getElementById('semantic-ui');
  el.setAttribute('rel', 'preload');
  el.setAttribute('href', `/semantic_v2${isRTL ? '.rtl' : ''}.min.css`);
  el.onload = () => el.setAttribute('rel', 'stylesheet');

  // change root element direction
  const root = document.getElementById('root');
  root.setAttribute('style', `direction: ${direction};`);
  if (isRTL) {
    root.classList.add('rtl');
  } else {
    root.classList.remove('rtl');
  }
};
