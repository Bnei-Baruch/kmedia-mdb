import React, { useEffect } from 'react';
import ReactGA from 'react-ga';

const sendPageChange = (page) => {
  ReactGA.set({ page });
  ReactGA.pageview(page);
};

const GAPageView = ({ location: { pathname, search } }) => {
  useEffect(() => {
    sendPageChange(pathname + search);
  }, [pathname, search]);

  return <></>;
};

export default GAPageView;
