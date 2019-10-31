import { withRouter } from 'react-router';

import * as shapes from '../../shapes';
import { useEffect } from 'react';

const ScrollToTop = ({ location, children }) => {
  // componentDidUpdate has a rather strict purpose
  // see these links before putting more logic here
  // https://reactjs.org/docs/react-component.html#componentdidupdate
  // https://developmentarc.gitbooks.io/react-indepth/content/life_cycle/update/postrender_with_componentdidupdate.html
  useEffect(
    () => {
      if (window.pageYOffset) {
        window.scrollTo(0, 0);
      }
    },
    [location]
  );

  return children;
};

ScrollToTop.propTypes = {
  location: shapes.HistoryLocation.isRequired,
  children: shapes.Children.isRequired
};

export default withRouter(ScrollToTop);
