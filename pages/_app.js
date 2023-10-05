import React from 'react';
import { appWithTranslation } from 'next-i18next';
import { wrapper } from '../lib/redux';
import '../styles/global.scss';
import Layout from './Layout';
import { Provider } from 'react-redux';
import { Providers } from '../lib/providers';
import { fetchSQData } from '../lib/redux/slices/mdbSlice';

const KmediaApp = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <Providers>
        <Layout>
          <Component {...props.pageProps} />
        </Layout>
      </Providers>
    </Provider>
  );
};

KmediaApp.getInitialProps = wrapper.getInitialAppProps(store => async ({ locale }) => {
  await store.dispatch(fetchSQData());
  return {};
});

export default appWithTranslation(KmediaApp);
