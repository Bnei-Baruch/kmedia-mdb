import React from 'react';

import Header from '../src/components/Layout/Header';
import DownloadTrim from '../src/components/Share/DownloadTrim';
import Footer from '../src/components/Layout/Footer';
import DonationPopup from '../src/components/Sections/Home/DonationPopup';

const RootLayout = ({ children }) => {
  return (
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
  );
};

export default RootLayout;
