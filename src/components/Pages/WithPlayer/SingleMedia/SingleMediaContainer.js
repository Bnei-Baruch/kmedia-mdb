import React, { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import SingleMediaPage from './SingleMediaPage';
import { actions, selectors } from '../../../../redux/modules/playlist';

const SingleMediaContainer = ({ t }) => {

  const { id } = useParams();

  const cuId = useSelector(state => selectors.getInfo(state.playlist).cuId);

  const dispatch = useDispatch();

  useEffect(() => {
    if (id !== cuId) {
      dispatch(actions.singleMediaBuild(id));
    }
  }, [cuId, id]);

  return <SingleMediaPage />;
};

export default React.memo(withNamespaces()(SingleMediaContainer));
