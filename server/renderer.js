import { URL } from 'url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { matchRoutes } from 'react-router-config';
import { createMemoryHistory } from 'history';
import { Helmet } from 'react-helmet';
import pick from 'lodash/pick';
import moment from 'moment';
import serialize from 'serialize-javascript';
import UAParser from 'ua-parser-js';
import localStorage from 'mock-local-storage';

import routes from '../src/routes';
import { LANG_UKRAINIAN } from '../src/helpers/consts';
import { getLanguageDirection } from '../src/helpers/i18n-utils';
import { getLanguageFromPath } from '../src/helpers/url';
import createStore from '../src/redux/createStore';
import { actions as settings } from '../src/redux/modules/settings';
import App from '../src/components/App/App';
import i18nnext from './i18nnext';

// eslint-disable-next-line no-unused-expressions
localStorage; // DO NOT REMOVE - the import above does all the work

export default function serverRender(req, res, next, htmlData, criticalCSS) {
  console.log('serverRender', req.originalUrl);

  const language = getLanguageFromPath(req.originalUrl);
  moment.locale(language === LANG_UKRAINIAN ? 'uk' : language);
  const i18nServer = i18nnext.cloneInstance();
  i18nServer.changeLanguage(language, (err) => {
    if (err) {
      next(err);
      return;
    }

    const history = createMemoryHistory({
      initialEntries: [req.originalUrl],
    });

    const initialState = {
      router: { location: history.location },
      device: { deviceInfo: new UAParser(req.get('user-agent')).getResult() },
    };

    const store = createStore(initialState, history);

    store.dispatch(settings.setLanguage(language));

    const context = {
      req,
      data: {},
      head: [],
      i18n: i18nServer,
    };

    const reqPath = req.originalUrl.split('?')[0];
    const branch  = matchRoutes(routes, reqPath);

    let hrstart    = process.hrtime();
    const promises = branch.map(({ route, match }) => (
      route.ssrData
        ? route.ssrData(store, { ...match, parsedURL: new URL(req.originalUrl, 'https://example.com') })
        : Promise.resolve(null)
    ));

    let hrend = process.hrtime(hrstart);
    console.log('serverRender: fire ssrLoaders %ds %dms', hrend[0], hrend[1] / 1000000);
    hrstart = process.hrtime();

    Promise.all(promises)
      .then(() => {
        store.stopSagas();
        hrend = process.hrtime(hrstart);
        console.log('serverRender: Promise.all(promises) %ds %dms', hrend[0], hrend[1] / 1000000);
        hrstart = process.hrtime();

        store.rootSagaPromise
          .then(() => {
            hrend = process.hrtime(hrstart);
            console.log('serverRender: rootSagaPromise.then %ds %dms', hrend[0], hrend[1] / 1000000);
            hrstart = process.hrtime();

            // actual render
            const markup = ReactDOMServer.renderToString(<App i18n={context.i18n} store={store} history={history} />);
            hrend        = process.hrtime(hrstart);
            console.log('serverRender: renderToString %ds %dms', hrend[0], hrend[1] / 1000000);
            hrstart = process.hrtime();

            const helmet = Helmet.renderStatic();
            hrend        = process.hrtime(hrstart);
            console.log('serverRender:  Helmet.renderStatic %ds %dms', hrend[0], hrend[1] / 1000000);
            hrstart = process.hrtime();

            if (context.url) {
              // Somewhere a `<Redirect>` was rendered
              res.redirect(301, context.url);
            } else {
              // we're good, add in markup, send the response
              const direction    = getLanguageDirection(language);
              const cssDirection = direction === 'ltr' ? '' : '.rtl';

              const state     = store.getState();
              const storePick = pick(state, [
                'router',
                'device',
                'settings',
                'mdb',
                'filters',
                'lists',
                'home',
                'programs',
                'events',
                'publications',
                'search',
                'assets',
              ]);

              storePick.mdb.errors = {
                units: {},
                collections: {},
                lastLesson: null,
              };

              // console.log(util.inspect(storePick, { showHidden: true, depth: null }));
              const storeData = serialize(storePick);

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
                .replace(/<html lang="en">/, `<html ${helmet.htmlAttributes.toString()} >`)
                .replace(/<title>.*<\/title>/, helmet.title.toString())
                .replace(/<\/head>/, `${helmet.meta.toString()}${helmet.link.toString()}<style type="text/css">${criticalCSS}</style></head>`)
                .replace(/<body>/, `<body ${helmet.bodyAttributes.toString()} >`)
                .replace(/semantic_v2.min.css/g, `semantic_v2${cssDirection}.min.css`)
                .replace(/<div id="root"><\/div>/, rootDiv);

              if (context.code) {
                res.status(context.code);
              }

              res.send(html);
              hrend = process.hrtime(hrstart);
              console.log('serverRender: res.send %ds %dms', hrend[0], hrend[1] / 1000000);
            }
          })
          .catch(next);
      })
      .catch(next);
  });
}
