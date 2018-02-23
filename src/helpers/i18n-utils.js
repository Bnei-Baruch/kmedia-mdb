import { RTL_LANGUAGES } from '../helpers/consts';

export const changeDirectionIfNeeded = (language) => {
  const el               = document.getElementById('root');
  const currentDirection = el.style.getPropertyValue('direction');
  const newDirection     = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';

  if (currentDirection !== newDirection) {
    changeDirection(newDirection);
  }
};

const changeDirection = (direction) => {
  const isRTL = direction === 'rtl';

  // replace semantic-ui css
  const oldlink = document.getElementById('semantic-ui');

  const newlink = document.createElement('link');
  newlink.setAttribute('rel', 'preload');
  newlink.setAttribute('type', 'text/css');
  newlink.setAttribute('id', 'semantic-ui');
  newlink.setAttribute('href', `/semantic_v2${isRTL ? '.rtl' : ''}.min.css`);
  newlink.onload = () => {
    newlink.setAttribute('rel', 'stylesheet');
    oldlink.remove();
  };
  document.getElementsByTagName('head').item(0).appendChild(newlink);

  // change root element direction
  const root = document.getElementById('root');
  root.setAttribute('style', `direction: ${direction};`);
  if (isRTL) {
    root.classList.add('rtl');
  } else {
    root.classList.remove('rtl');
  }
};
