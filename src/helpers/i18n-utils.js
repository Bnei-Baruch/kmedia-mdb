import { BLOGS, DEFAULT_UI_DIR, LANGUAGES, TWITTER_USERNAMES } from './consts';

export const getCurrentDirection = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return document.getElementById('root').style.getPropertyValue('direction');
};

export const changeDirection = direction => {
  if (typeof window === 'undefined') {
    return;
  }

  const isRTL = direction === 'rtl';

  // replace semantic-ui css
  // We remove current loaded css once new css finish loading.
  // Something in the spirit of https://github.com/filamentgroup/loadCSS

  const oldCSS = document.getElementById('semantic-ui');

  const href = `/semantic_v4${isRTL ? '.rtl' : ''}.min.css`;
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
      root.classList.remove('ltr');
      root.classList.add('rtl');
    } else {
      root.classList.remove('rtl');
      root.classList.add('ltr');
    }
  }

  if (ss.addEventListener) {
    ss.addEventListener('load', loadCB);
  }
};

const rtlLngs = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm', 'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb', 'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he', 'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo', 'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam'];

export const getLanguageDirection = language => {
  if (!language) {
    return DEFAULT_UI_DIR;
  }

  return isLanguageRtl(language) ? 'rtl' : 'ltr';
};

export const isLanguageRtl = language => rtlLngs.indexOf(language) >= 0;

export const getDirectionProperty = dir => dir === 'rtl' ? 'right' : 'left';

export const getLangPropertyDirection = language => getDirectionProperty(getLanguageDirection(language));

export const getLanguageLocale = language => LANGUAGES[language].locale;

export const getLanguageLocaleWORegion = language => LANGUAGES[language].locale.substring(0, 2);

export const getBlogLanguage = name => {
  const blog = BLOGS.find(blog => blog.name === name);
  return blog && (blog.language || null);
};

export const getTwitterLanguage = username => {
  const twitter = TWITTER_USERNAMES.find(twitter => twitter.username === username);
  return twitter && (twitter.language || null);
};
