import React from 'react';
import { appWithTranslation } from 'next-i18next';
import { wrapper } from '../lib/redux';
import '../styles/global.scss';
import Layout from './Layout';
import { Provider } from 'react-redux';
import { Providers } from '../lib/providers';
import Script from 'next/script';

const KmediaApp = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);

  //await store.dispatch(fetchSQData());
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
/*
class KmediaApp extends App {
  //TODO: try to use getStaticProps
  static getInitialProps = wrapper.getInitialAppProps(store => async context => {
    await store.dispatch(fetchSQData());

    return {
      // https://nextjs.org/docs/advanced-features/custom-app#caveats
      pageProps: { ...(await App.getInitialProps(context)).pageProps },
    };
  });

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }
}
*/

export default appWithTranslation(KmediaApp);
