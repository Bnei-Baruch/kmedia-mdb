import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { actions } from '../../../../redux/modules/my';
import {
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_REACTIONS,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_SUBSCRIPTIONS
} from '../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import WipErr from '../../../shared/WipErr/WipErr';
import ContentItem from '../../../shared/ContentItem/ContentItemContainer';
import { PlaylistItem } from './PlaylistItem';
import { SubscriptionsItem } from './SubscriptionsItem';
import ItemTemplate from './ItemTemplate';
import { getMyItemKey } from '../../../../helpers/my';
import {
  myGetListSelector,
  myGetErrSelector,
  myGetWipSelector,
  settingsGetUILangSelector
} from '../../../../redux/selectors';

const ItemsContainer = ({ pageSize = 8, pageNo = 1, namespace, withSeeAll }) => {
  const { t } = useTranslation();
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const uiLang             = useSelector(settingsGetUILangSelector);
  const dispatch           = useDispatch();

  useEffect(() => {
    dispatch(actions.fetch(namespace, { page_no: pageNo, page_size: pageSize }));
  }, [dispatch, pageNo, pageSize, uiLang, namespace]);

  const items = useSelector(state => myGetListSelector(state, namespace));
  const err   = useSelector(state => myGetErrSelector(state, namespace));
  const wip   = useSelector(state => myGetWipSelector(state, namespace));

  if (wip || err) return WipErr({ wip, err, t });
  if (items.length === 0)
    return <ItemTemplate namespace={namespace} children={[]} t={t}/>;

  let children = null;

  switch (namespace) {
    case MY_NAMESPACE_REACTIONS:
      children = items.map(x => {
        const { key } = getMyItemKey(namespace, x);
        return <ContentItem id={x.subject_uid} key={key} asList={isMobileDevice}/>;
      });
      break;
    case MY_NAMESPACE_HISTORY:
      children = (
        items.map(x => {
          const { key } = getMyItemKey(namespace, x);
          return <ContentItem
            id={x.content_unit_uid}
            key={key}
            playTime={x.data.current_time}
            asList={isMobileDevice}
          />;
        })
      );
      break;
    case MY_NAMESPACE_PLAYLISTS:
      children = items.map(x => {
        const { key } = getMyItemKey(namespace, x);
        return <PlaylistItem item={x} key={key} t={t} asList={isMobileDevice}/>;
      });
      break;
    case MY_NAMESPACE_SUBSCRIPTIONS:
      children = items.map(
        x => {
          const { key } = getMyItemKey(namespace, x);
          return <SubscriptionsItem item={x} key={key} t={t}/>;
        }
      );
      break;
    default:
      break;
  }

  if (isMobileDevice && [MY_NAMESPACE_PLAYLISTS, MY_NAMESPACE_REACTIONS, MY_NAMESPACE_HISTORY].includes(namespace)) {
    children = items?.length > 0 ? <div className=" px-4 ">{children}</div> : null;
  } else {
    children = <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 cu_items">{children}</div>;
  }

  return <ItemTemplate namespace={namespace} children={children} t={t} withSeeAll={withSeeAll}/>;
};

ItemsContainer.propTypes = {
  namespace: PropTypes.string.isRequired,
  pageSize : PropTypes.number,
  pageNo   : PropTypes.number
};

export default ItemsContainer;
