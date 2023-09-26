import React from 'react';

import Header from '../src/components/Layout/Header';
import DownloadTrim from '../src/components/Share/DownloadTrim';
import Footer from '../src/components/Layout/Footer';
import DonationPopup from '../src/components/Sections/Home/DonationPopup';
import { wrapper } from '../lib/redux';
import { fetchSQData } from '../lib/redux/slices/sourcesSlice';

export const getStaticProps = wrapper.getStaticProps(store => async ({ locale }) => {
  const lang = locale ?? 'en';

  await store.dispatch(fetchSQData());
  return {};
});

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
