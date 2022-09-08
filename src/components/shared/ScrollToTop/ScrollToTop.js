import { useEffect } from 'react';
import { getQuery } from '../../../helpers/url';

import * as shapes from '../../shapes';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ children }) => {
  const location           = useLocation();
  const { page, ...query } = getQuery(location);

  useEffect(
    () => {
      if (window.pageYOffset) {
        window.scrollTo(0, 0);
      }
    },
    [location.pathname, page]
  );

  return children;
};

ScrollToTop.propTypes = {
  children: shapes.Children.isRequired
};

export default ScrollToTop;
