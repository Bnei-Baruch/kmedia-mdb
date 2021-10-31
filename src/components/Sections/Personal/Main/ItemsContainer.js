import React, { useContext, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Card, Container } from 'semantic-ui-react';

import { actions, selectors } from '../../../../redux/modules/my';
import { selectors as settings } from '../../../../redux/modules/settings';
import {
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_REACTIONS,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_SUBSCRIPTIONS
} from '../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import WipErr from '../../../shared/WipErr/WipErr';
import CUItem from '../../../shared/CUItem/CUItemContainer';
import { PlaylistItem } from './PlaylistItem';
import { SubscriptionsItem } from './SubscriptionsItem';
import ItemTemplate from './ItemTemplate';
import { getMyItemKey } from '../../../../helpers/my';

const ItemsContainer = ({ pageSize = 8, pageNo = 1, t, namespace, withSeeAll }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const language           = useSelector(state => settings.getLanguage(state.settings));
  const dispatch           = useDispatch();

  useEffect(() => {
    dispatch(actions.fetch(namespace, { page_no: pageNo, page_size: pageSize }));
  }, [dispatch, pageNo, pageSize, language, namespace]);

  const items = useSelector(state => selectors.getList(state.my, namespace));
  const err   = useSelector(state => selectors.getErr(state.my, namespace));
  const wip   = useSelector(state => selectors.getWIP(state.my, namespace));

  if (wip || err) return WipErr({ wip, err, t });
  if (items.length === 0) return null;
  let children = null;

  switch (namespace) {
    case MY_NAMESPACE_REACTIONS:
      children = items.map(x => {
        const { key } = getMyItemKey(namespace, x);
        return <CUItem id={x.subject_uid} key={key} asList={isMobileDevice} />;
      });
      break;
    case MY_NAMESPACE_HISTORY:
      children = (
        items.map(x => {
            const { key } = getMyItemKey(namespace, x);
            return <CUItem
              id={x.content_unit_uid}
              key={key}
              playTime={x.data.current_time}
              asList={isMobileDevice}
            />;
          }
        )
      );
      break;
    case MY_NAMESPACE_PLAYLISTS:
      children = items.map(x => {
        const { key } = getMyItemKey(namespace, x);
        return <PlaylistItem item={x} key={key} language={language} t={t} asList={isMobileDevice} />;
      });
      break;
    case MY_NAMESPACE_SUBSCRIPTIONS:
      children = items.map(x => {
          const { key } = getMyItemKey(namespace, x);
          return <SubscriptionsItem item={x} key={key} t={t} language={language} />;
        }
      );
      break;
    default:
      break;
  }

  if (isMobileDevice && [MY_NAMESPACE_PLAYLISTS, MY_NAMESPACE_REACTIONS, MY_NAMESPACE_HISTORY].includes(namespace)) {
    children = items?.length > 0 ? <Container className="padded" children={children} /> : null;
  } else {
    children = <Card.Group doubling itemsPerRow={4} stackable className="cu_items">{children}</Card.Group>;
  }

  return <ItemTemplate namespace={namespace} children={children} t={t} withSeeAll={withSeeAll} language={language} />;
};

ItemsContainer.propTypes = {
  namespace: PropTypes.string.isRequired,
  pageSize: PropTypes.number,
  pageNo: PropTypes.number,
};

export default withNamespaces()(ItemsContainer);
