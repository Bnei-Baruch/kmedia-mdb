import React, { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from '../../../../redux/modules/my';
import { selectors as mdb } from '../../../../redux/modules/mdb';
import { selectors as settings } from '../../../../redux/modules/settings';
import {
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_LIKES,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_SUBSCRIPTIONS
} from '../../../../helpers/consts';
import WipErr from '../../../shared/WipErr/WipErr';
import { PlaylistItem } from './PlaylistItem';
import { SubscriptionsItem } from './SubscriptionsItem';
import CUItem from '../../../shared/CUItem/CUItemContainer';
import ItemTemplate from './ItemTemplate';

const ItemsByNamespace = ({ pageSize = 8, pageNo = 1, t, namespace, withSeeAll }) => {
  const language = useSelector(state => settings.getLanguage(state.settings));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetch(namespace, { page_no: pageNo, page_size: pageSize }));
  }, [dispatch, pageNo, pageSize, language]);

  const items = useSelector(state => selectors.getItems(state.my, namespace));
  const err   = useSelector(state => selectors.getErr(state.my, namespace));
  const wip   = useSelector(state => selectors.getWIP(state.my, namespace));

  if (wip || err) return WipErr({ wip, err, t });
  if (items.length === 0) return null;
  let children = null;

  switch (namespace) {
  case MY_NAMESPACE_HISTORY:
  case MY_NAMESPACE_LIKES:
    children = items.map(x => <CUItem id={x.content_unit_uid} key={`${namespace}_${x.id}`}  />);
    break;
  case MY_NAMESPACE_PLAYLISTS:
    children = items.map(x => <PlaylistItem item={x} key={`${namespace}_${x.id}`} t={t} />);
    break;
  case MY_NAMESPACE_SUBSCRIPTIONS:
    children = items.map(x => <SubscriptionsItem item={x} key={`${namespace}_${x.id}`} t={t} />);
    break;
  default:
    break;
  }

  return <ItemTemplate namespace={namespace} children={children} t={t} withSeeAll={withSeeAll} />;
};

ItemsByNamespace.propTypes = {
  namespace: PropTypes.string.isRequired,
  pageSize: PropTypes.number,
  pageNo: PropTypes.number,
};

export default withNamespaces()(ItemsByNamespace);
