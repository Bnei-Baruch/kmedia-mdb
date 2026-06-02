import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

export const withRouter = Component => {
  function WithRouterPatch(props) {
    const location = useLocation();
    const params = useParams();

    return <Component {...props} location={location} navigate={undefined} params={params}/>;
  }

  return WithRouterPatch;
};
