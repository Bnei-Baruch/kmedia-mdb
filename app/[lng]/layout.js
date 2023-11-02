import React from 'react';
import '../../styles/global.scss';
import Header from './components/Header';
import { Providers } from '../../lib/providers';
import Footer from './components/Footer';
import DownloadTrim from '../../src/components/Share/DownloadTrim';

export default function RootLayout({ children, params: { lng } }) {
  return (
    <Providers>
      <html lang={lng}>
      <head>
        <meta charSet="utf-8" />
        {
          lng === 'he' ? (
              <>
                <link rel="stylesheet" href="/semantic_v4.min.css" />
                <link rel="stylesheet" href="/semantic_v4.rtl.min.css" />
              </>
            ) :
            <link rel="stylesheet" href="/semantic_v4.min.css" />
        }
      </head>
      <body>
      <div className="layout">
        <Header lng={lng} />
        <div className="layout__main">
          <div className="layout__content">
            <DownloadTrim />
            {children}
          </div>
          <Footer />
        </div>
        {/*<DonationPopup />*/}
      </div>
      </body>
      </html>
    </Providers>
  );
};
