import React from 'react';
import App from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { wrapper } from '../lib/redux';
import '../styles/global.scss';
import Layout from './Layout';
import { fetchSQData } from '../lib/redux/slices/sourcesSlice';

class KmediaApp extends App {
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

export default appWithTranslation(wrapper.withRedux(KmediaApp));
