import React, { useEffect } from 'react';
import ReactGA from 'react-ga';

const sendPageChange = page => {
  // eslint-disable-next-line import/no-named-as-default-member
  ReactGA.set({ page });
  // eslint-disable-next-line import/no-named-as-default-member
  ReactGA.pageview(page);
};

const GAPageView = ({ location: { pathname, search } }) => {
  useEffect(() => {
    sendPageChange(pathname + search);
  }, [pathname, search]);

  return <></>;
};

export default GAPageView;
