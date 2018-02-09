import path from 'path';
import fs from 'fs';
import serialize from 'serialize-javascript';

import { renderApp, renderHead } from './serverRender';
import createStore from '../src/redux/createStore';
import applicationSaga from '../src/sagas/application';
import { actions as settings } from '../src/redux/modules/settings';
import { getLanguageFromPath } from '../src/helpers/url';
import { getLanguageDirection } from '../src/helpers/i18n-utils';
import i18n from '../src/helpers/i18nnext';

// this does most of the heavy lifting
async function serverRender(req, res, htmlData) {
  const context = { data: {}, head: [], req };
  const store   = createStore();
  // first render
  // uncomment when we can make async actions aware there are no sagas because they will never resolve
  // render(req, store, context);

  if (context.url) {
    // Somewhere a `<Redirect>` was rendered
    res.redirect(301, context.url);
  }

  await store
    .sagaMiddleWare.run(applicationSaga).done
    .catch((error) => {
      console.log('application saga error: ', error);
    }) // keep going if application saga throws
    .then(() => {
      const locale     = getLanguageFromPath(req.url);
      const resources  = i18n.getResourceBundle(locale, 'common');
      const i18nClient = { locale, resources };
      const i18nServer = i18n.cloneInstance();

      return new Promise((resolve) => {
        i18nServer.changeLanguage(locale, () => {
          store.dispatch(settings.setLanguage(locale));

          context.i18n = i18nServer;

          // second render
          const markup     = renderApp(req, store, context);
          // TODO(yaniv): render head as part of the entire application or create a react component for it
          const headMarkup = renderHead(context);

          if (context.url) {
            // Somewhere a `<Redirect>` was rendered
            res.redirect(301, context.url);
          } else {
            // we're good, add in markup, send the response
            const direction    = getLanguageDirection(locale);
            const cssDirection = direction === 'ltr' ? '' : '.rtl';

            const RenderedApp = htmlData
              .replace('{{rootDirection}}', direction)
              .replace('{{cssDirection}}', cssDirection)
              .replace('{{SSR}}', markup)
              .replace('<meta-head/>', headMarkup)
              .replace('{{data}}', serialize(store.getState()))
              .replace('{{i18n}}', serialize(i18nClient));

            if (context.code) {
              res.status(context.code);
            }

            res.send(RenderedApp);
          }

          store.stopSagas();
          resolve();
        });
      });

    });
}

export default function universalLoader(req, res) {
  const filePath = path.resolve(__dirname, '..', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('read err', err);
      return res.status(404).end();
    }

    serverRender(req, res, htmlData)
      .catch((err) => {
        console.error('Render Error', err);
        return res.status(500).json({ message: 'Render Error' });
      });
  });
};
