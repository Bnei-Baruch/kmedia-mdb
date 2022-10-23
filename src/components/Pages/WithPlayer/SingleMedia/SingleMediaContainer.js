import React, { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import SingleMediaPage from './SingleMediaPage';
import { actions, selectors } from '../../../../redux/modules/playlist';

const SingleMediaContainer = ({ t }) => {

  const { id } = useParams();

  const { cuId, wip } = useSelector(state => selectors.getInfo(state.playlist));

  const dispatch = useDispatch();

  useEffect(() => {
    if (wip) return;

    if (id !== cuId) {
      dispatch(actions.singleMediaBuild(id));
    }
  }, [cuId, id, wip]);

  return <SingleMediaPage />;
};

export default React.memo(withNamespaces()(SingleMediaContainer));
