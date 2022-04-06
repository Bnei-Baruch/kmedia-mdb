import { withRouter } from 'react-router';

import * as shapes from '../../shapes';
import { useEffect } from 'react';

const ScrollToTop = ({ location, children }) => {
  // componentDidUpdate has a rather strict purpose
  // see these links before putting more logic here
  // https://reactjs.org/docs/react-component.html#componentdidupdate
  // https://developmentarc.gitbooks.io/react-indepth/content/life_cycle/update/postrender_with_componentdidupdate.html

  //const ref = useRef();
  useEffect(
    () => {
      if (window.pageYOffset) {
        window.scrollTo(0, 0);
        /*const { hash } = location;
        if (hash !== ref.current) {
          window.scrollTo(0, 0);
          ref.current = hash;
        }*/
      }
    },
    [location.hash]
  );

  return children;
};

ScrollToTop.propTypes = {
  location: shapes.HistoryLocation.isRequired,
  children: shapes.Children.isRequired
};

export default withRouter(ScrollToTop);
