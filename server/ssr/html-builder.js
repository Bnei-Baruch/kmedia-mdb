import serialize from 'serialize-javascript';
import { pick } from 'lodash/object';
import { getLanguageDirection } from '../../src/helpers/i18n-utils';
import { KC_BOT_USER_NAME } from '../../src/helpers/consts';
import { generateSEOTags } from './seo-helpers';

const KC_API_URL = process.env.REACT_KC_API_URL;
const KC_REALM = process.env.REACT_KC_REALM;
const KC_CLIENT_ID = process.env.REACT_KC_CLIENT_ID;

/**
 * Generates window environment variables script
 * @returns {string} - JavaScript code to set window variables
 */
function windowEnvVariables() {
  const vars = [];
  
  if (KC_API_URL) {
    vars.push(`window.KC_API_URL = '${KC_API_URL}';`);
  }
  
  if (KC_REALM) {
    vars.push(`window.KC_REALM = '${KC_REALM}';`);
  }
  
  if (KC_CLIENT_ID) {
    vars.push(`window.KC_CLIENT_ID = '${KC_CLIENT_ID}';`);
  }

  return vars.join('');
}

/**
 * Builds the root div with SSR content and data
 * @param {string} markup - Rendered React HTML
 * @param {Object} storeData - Redux store state
 * @param {Object} i18n - i18next instance
 * @param {string} direction - Text direction (ltr/rtl)
 * @returns {string} - HTML for root div with scripts
 */
export function buildRootDiv(markup, storeData, i18n, direction) {
  const i18nData = serialize({
    initialLanguage: i18n.language,
    initialI18nStore: pick(i18n.services.resourceStore.data, [
      i18n.language,
      i18n.options.fallbackLng
    ])
  });

  const storeDataStr = serialize(storeData);
  const isBotAuth = storeData.auth?.user?.name === KC_BOT_USER_NAME;

  return `
    <div id="root" class="${direction}" style="direction: ${direction}">${markup}</div>
    <script>
      window.__botKCInfo = ${isBotAuth ? serialize(storeData.auth) : false};
      window.__data = ${storeDataStr};
      window.__i18n = ${i18nData};
      ${windowEnvVariables()}
    </script>
  `;
}

/**
 * Builds the complete SSR HTML by replacing placeholders
 * @param {string} htmlTemplate - Original HTML template
 * @param {Object} options - Build options
 * @returns {string} - Complete HTML
 */
export function buildSSRHtml(htmlTemplate, options) {
  const {
    markup,
    storeData,
    i18n,
    uiLang,
    helmet,
    req,
    direction = getLanguageDirection(uiLang),
    cssDirection = direction === 'ltr' ? '' : '.rtl'
  } = options;

  const rootDiv = buildRootDiv(markup, storeData, i18n, direction);
  const seoTags = generateSEOTags(req, uiLang);

  return htmlTemplate
    .replace(/<html lang="en">/, `<html lang="en" ${helmet.htmlAttributes.toString()} >`)
    .replace(/lang="en"/, `lang="${uiLang}"`)
    .replace(/<title>.*<\/title>/, helmet.title.toString())
    .replace(
      /<\/head>/,
      `${helmet.meta.toString()}${helmet.link.toString()}${seoTags}</head>`
    )
    .replace(/<body>/, `<body ${helmet.bodyAttributes.toString()} >`)
    .replace(/semantic_v4.min.css/g, `semantic_v4${cssDirection}.min.css`)
    .replace(/<div id="root"><\/div>/, rootDiv);
}

/**
 * Builds minimal HTML for SSO authentication flow
 * @param {string} htmlTemplate - Original HTML template
 * @returns {string} - Minimal HTML with auth scripts
 */
export function buildSSOAuthHtml(htmlTemplate) {
  const rootDiv = `
    <div id="root"></div>
    <script>
      ${windowEnvVariables()}
    </script>
  `;

  return htmlTemplate.replace(/<div id="root"><\/div>/, rootDiv);
}

