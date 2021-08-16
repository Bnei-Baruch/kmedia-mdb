import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Modal } from 'semantic-ui-react';

import { MY_NAMESPACE_LIKES } from '../../../../../helpers/consts';
import * as shapes from '../../../../shapes';
import { selectors } from '../../../../../redux/modules/auth';
import { actions, selectors as myselector } from '../../../../../redux/modules/my';
import PlaylistInfo from './PlaylistInfo';

const PersonalInfo = ({ unit = {}, t, currentCollection = null }) => {
  const dispatch = useDispatch();
  const user     = useSelector(state => selectors.getUser(state.auth));

  const { collections, content_type: type, id } = unit;

  const likes = useSelector(state => myselector.getItems(state.my, MY_NAMESPACE_LIKES));
  const like  = likes?.find(l => l.content_unit_uid === id);

  useEffect(() => {
    if (id) {
      dispatch(actions.fetch(MY_NAMESPACE_LIKES, { 'uids': [id] }));
    }
  }, [dispatch, id, user]);

  const needToLogin = () => {
    alert('you need to login');
  };

  const likeDislike = (l) => {
    if (!user) return needToLogin();

    if (l)
      dispatch(actions.remove(MY_NAMESPACE_LIKES, { ids: [l.id] }));
    else
      dispatch(actions.add(MY_NAMESPACE_LIKES, { uids: [id] }));

    return null;
  };

  return (
    <>
      <Button floated={'right'} size={'tiny'} icon={`star ${!like ? 'outline' : ''}`} onClick={() => likeDislike(like)} />
      <PlaylistInfo unit={unit} user={user} t={t} />
    </>
  );
};

PersonalInfo.propTypes = {
  unit: shapes.ContentUnit,
  collection: shapes.Collection,

};

export default withNamespaces()(PersonalInfo);
