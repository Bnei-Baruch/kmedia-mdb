export const getCurrentDirection = () =>
  document.getElementById('root').style.getPropertyValue('direction');

export const changeDirection = (direction) => {
  const isRTL = direction === 'rtl';

  // replace semantic-ui css
  // We remove current loaded css once new css finish loading.
  // Something in the spirit of https://github.com/filamentgroup/loadCSS

  const oldCSS = document.getElementById('semantic-ui');

  const href = `/semantic_v2${isRTL ? '.rtl' : ''}.min.css`;
  const ss   = document.createElement('link');
  ss.rel     = 'stylesheet';
  ss.href    = href;
  oldCSS.parentNode.insertBefore(ss, oldCSS);

  function loadCB() {
    oldCSS.remove();

    ss.id = 'semantic-ui';
    ss.removeEventListener('load', loadCB);

    // change root element direction
    const root = document.getElementById('root');
    root.setAttribute('style', `direction: ${direction};`);
    if (isRTL) {
      root.classList.add('rtl');
    } else {
      root.classList.remove('rtl');
    }
  }

  if (ss.addEventListener) {
    ss.addEventListener('load', loadCB);
  }
};
