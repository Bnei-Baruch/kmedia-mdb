import { useEffect } from 'react';
import { withRouter } from 'react-router';
import { getQuery } from '../../../helpers/url';

import * as shapes from '../../shapes';

const ScrollToTop = ({ location, children }) => {
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
  location: shapes.HistoryLocation.isRequired,
  children: shapes.Children.isRequired
};

export default withRouter(ScrollToTop);
