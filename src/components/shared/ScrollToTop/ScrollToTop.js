import { useEffect } from 'react';
import { getQuery } from '../../../helpers/url';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();
  const { page } = getQuery(location);

  useEffect(
    () => {
      if (window.pageYOffset) {
        window.scrollTo(0, 0);
      }
    },
    [location.pathname, page]
  );

  return null;
};

export default ScrollToTop;
