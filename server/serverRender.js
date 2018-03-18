import React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { createMemoryHistory } from 'history';

import App from '../src/components/App/App';

export function renderApp(req, store, context) {
  const memoryHistory = createMemoryHistory({
    initialEntries: [req.originalUrl],
  });

  return renderToString(<App i18n={context.i18n} store={store} history={memoryHistory} />);
}

export function renderHead(context) {
  return context.head.map(h => (
    renderToStaticMarkup(h)
  )).join('');
}
