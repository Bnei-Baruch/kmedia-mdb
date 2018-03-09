import path from 'path';
import fs from 'fs';
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

function serverRender2(req, res, htmlData) {
  console.log('serverRender2', req.originalUrl);

  let hrstart = process.hrtime();

  const language = getLanguageFromPath(req.originalUrl);
  console.log('getLanguageFromPath', language);

  moment.locale(language);
  const i18nServer = i18nnext.cloneInstance();
  i18nServer.changeLanguage(language, () => {
    let hrend = process.hrtime(hrstart);
    console.log('serverRender: i18nServer.changeLanguage %ds %dms', hrend[0], hrend[1] / 1000000);
    hrstart = process.hrtime();

    const deviceInfo = new UAParser(req.get('user-agent')).getResult();
    console.log('deviceInfo', req.get('user-agent'), deviceInfo);
    const store      = createStore({ device: { deviceInfo } });
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

          const RenderedApp = htmlData
            .replace('{{rootDirection}}', `${direction}" style="direction: ${direction}`)
            .replace(/{{cssDirection}}/g, cssDirection)
            .replace('{{SSR}}', markup)
            .replace('<meta-head/>', headMarkup)
            // .replace('{{data}}', 'null')
            // .replace('{{data}}', serialize(store.getState()))
            .replace('{{data}}', serialize(pick(store.getState(), [
              'router',
              'device',
              'settings',
              'mdb',
              'filters',
              'lists',
              'home',
            ])))
            .replace('{{i18n}}', serialize(
              {
                initialLanguage: context.i18n.language,
                initialI18nStore: pick(context.i18n.services.resourceStore.data, [
                  context.i18n.language,
                  context.i18n.options.fallbackLng,
                ]),
              }
            ));

          if (context.code) {
            res.status(context.code);
          }

          res.send(RenderedApp);
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

export default function universalLoader(req, res) {
  const filePath = path.resolve(__dirname, '..', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('read err', err);
      return res.status(404).end();
    }

    serverRender2(req, res, htmlData);
  });
}
