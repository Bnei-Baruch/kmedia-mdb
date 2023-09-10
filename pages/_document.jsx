import Document, { Html, Head, Main, NextScript } from 'next/document';
import i18nextConfig from '../next-i18next.config';

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
        <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
