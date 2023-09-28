import Document, { Html, Head, Main, NextScript } from 'next/document';
import i18nextConfig from '../next-i18next.config';
import Script from 'next/script';
import React from 'react';

class MyDocument extends Document {
  render() {
    const currentLocale = this.props.__NEXT_DATA__.locale ?? i18nextConfig.i18n.defaultLocale;
    return (
      <Html lang={currentLocale}>
        <Head>
          <meta charSet="utf-8" />
          {
            currentLocale === 'he' ? (
                <>
                  <link rel="stylesheet" href="/semantic_v4.min.css" />
                  <link rel="stylesheet" href="/semantic_v4.rtl.min.css" />
                </>
              ) :
              <link rel="stylesheet" href="/semantic_v4.min.css" />
          }
        </Head>
        <body>
        <Main />
        <Script src="https://cdn.jwplayer.com/libraries/mxNkRalL.js" strategy="beforeInteractive" />
        <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
