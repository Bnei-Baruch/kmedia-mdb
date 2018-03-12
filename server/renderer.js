import path from 'path';
import fs from 'fs';
import http from 'http';
import pick from 'lodash/pick';
import moment from 'moment';
import serialize from 'serialize-javascript';
import UAParser from 'ua-parser-js';

import { getLanguageFromPath } from '../src/helpers/url';
import { getLanguageDirection } from '../src/helpers/i18n-utils';
import createStore from '../src/redux/createStore';
import { actions as settings } from '../src/redux/modules/settings';
import { renderApp, renderHead } from './serverRender';
import i18nnext from './i18nnext';
import { LANG_UKRAINIAN } from '../src/helpers/consts';

const CRA_CLIENT_PORT = process.env.CRA_CLIENT_PORT || 3000;

function serverRender2(req, res, htmlData) {
  console.log('serverRender2', req.originalUrl);

  let hrstart = process.hrtime();

  const language = getLanguageFromPath(req.originalUrl);
  console.log('getLanguageFromPath', language);

  moment.locale(language === LANG_UKRAINIAN ? 'uk' : language);
  const i18nServer = i18nnext.cloneInstance();
  i18nServer.changeLanguage(language, () => {
    let hrend = process.hrtime(hrstart);
    console.log('serverRender: i18nServer.changeLanguage %ds %dms', hrend[0], hrend[1] / 1000000);
    hrstart = process.hrtime();

    const deviceInfo = new UAParser(req.get('user-agent')).getResult();
    console.log('deviceInfo', req.get('user-agent'), deviceInfo);
    const store = createStore({ device: { deviceInfo } });
    store.dispatch(settings.setLanguage(language));

    const context = {
      req,
      data: {},
      head: [],
      i18n: i18nServer,
    };

    store.rootSagaPromise
      .catch((error) => {
        console.log('root saga error: ', error);
      }) // keep going if root saga throws
      .then(() => {
        hrend = process.hrtime(hrstart);
        console.log('serverRender: Promise.all resolved %ds %dms', hrend[0], hrend[1] / 1000000);
        hrstart = process.hrtime();

        // second render
        const markup = renderApp(req, store, context);
        hrend        = process.hrtime(hrstart);
        console.log('serverRender: render #2 %ds %dms', hrend[0], hrend[1] / 1000000);
        hrstart = process.hrtime();

        // TODO(yaniv): render head as part of the entire application or create a react component for it
        const headMarkup = renderHead(context);
        hrend            = process.hrtime(hrstart);
        console.log('serverRender: renderHead %ds %dms', hrend[0], hrend[1] / 1000000);
        hrstart = process.hrtime();

        if (context.url) {
          // Somewhere a `<Redirect>` was rendered
          res.redirect(301, context.url);
        } else {
          // we're good, add in markup, send the response
          const direction    = getLanguageDirection(language);
          const cssDirection = direction === 'ltr' ? '' : '.rtl';

          const storeData = serialize(pick(store.getState(), [
            'router',
            'device',
            'settings',
            'mdb',
            'filters',
            'lists',
            'home',
          ]));

          const i18nData = serialize(
            {
              initialLanguage: context.i18n.language,
              initialI18nStore: pick(context.i18n.services.resourceStore.data, [
                context.i18n.language,
                context.i18n.options.fallbackLng,
              ]),
            }
          );

          const rootDiv = `<div id="root" class="${direction}" style="direction: ${direction}">
  ${markup}
</div>
<script>
  window.__data = ${storeData};
  window.__i18n = ${i18nData};
</script>`;

          const html = htmlData
            .replace(/semantic_v2.min.css/g, `semantic_v2${cssDirection}.min.css`)
            .replace(/<div id="root"><\/div>/, rootDiv);

          // const RenderedApp = htmlData
          //   .replace('{{rootDirection}}', `${direction}" style="direction: ${direction}`)
          //   .replace(/{{cssDirection}}/g, cssDirection)
          //   .replace('{{SSR}}', markup)
          //   .replace('<meta-head/>', headMarkup)
          //   .replace('{{data}}', storeData)
          //   .replace('{{i18n}}', i18nData);

          if (context.code) {
            res.status(context.code);
          }

          res.send(html);
          hrend = process.hrtime(hrstart);
          console.log('serverRender: res.send %ds %dms', hrend[0], hrend[1] / 1000000);
        }
      });

    renderApp(req, store, context);
    hrend = process.hrtime(hrstart);
    console.log('serverRender: render #1 %ds %dms', hrend[0], hrend[1] / 1000000);
    hrstart = process.hrtime();

    store.stopSagas();
    hrend = process.hrtime(hrstart);
    console.log('serverRender: store.stopSagas() %ds %dms', hrend[0], hrend[1] / 1000000);
    hrstart = process.hrtime();
  });
}

function handleDevMode(req, res) {
  http.get(`http://localhost:${CRA_CLIENT_PORT}/index.html`, (result) => {
    result.setEncoding('utf8');
    let htmlData = '';
    result.on('data', (chunk) => {
      htmlData += chunk;
    });
    result.on('end', () => {
      serverRender2(req, res, htmlData);
    });
  }).on('error', (e) => {
    console.error(e.message);
    return res.status(404).end();
  });
}

export default function universalLoader(req, res) {
  if (process.env.NODE_ENV === 'development') {
    handleDevMode(req, res);
    return;
  }

  const filePath = path.resolve(__dirname, '..', 'build', 'index.html');

  // eslint-disable-next-line consistent-return
  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('read err', err);
      return res.status(404).end();
    }

    serverRender2(req, res, htmlData);
  });
}
