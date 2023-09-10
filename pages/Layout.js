import React from 'react';
//import DonationPopup from '../../src/components/Sections/Home/DonationPopup';
import UAParser from 'ua-parser-js';
import { Providers } from '../lib/providers';
import Header from '../src/components/Layout/Header';
import DownloadTrim from '../src/components/Share/DownloadTrim';
import Footer from '../src/components/Layout/Footer';
import DonationPopup from '../src/components/Sections/Home/DonationPopup';

const RootLayout = ({ children }) => {
  const deviceInfo = new UAParser().getResult();
  return (
    <Providers deviceInfo={deviceInfo}>
      <div className="layout">
        <Header />
        <div className="layout__main">
          <div className="layout__content">
            <DownloadTrim />
            {children}
          </div>
          <Footer />
        </div>
        <DonationPopup />
      </div>
    </Providers>
  );
};

export default RootLayout;
