import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Container, Button, Grid } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import { withNamespaces } from 'react-i18next';
import Link from '../../Language/MultiLanguageLink';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../redux/modules/my';
import { selectors as mdb } from '../../../redux/modules/mdb';
import WipErr from '../../shared/WipErr/WipErr';
import {
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_LIKES,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_SUBSCRIPTIONS
} from '../../../helpers/consts';
import { HistoryItem } from './HistoryItem';
import { LikeItem } from './LikeItem';
import { PlaylistItem } from './PlaylistItem';
import { SubscriptionsItem } from './SubscriptionsItem';
import AlertModal from '../../shared/AlertModal';

const Template = ({ children, namespace, t, withSeeAll = false }) => {
  const itemsPerRow = 4;
  const seeAll      = withSeeAll ? (
    <Grid.Column>
      <Link to={`/personal/${namespace}`}>
        <Button floated='right' basic color='blue'>
          {t('search.showAll')}
        </Button>
      </Link>
    </Grid.Column>
  ) : null;

  return (
    <div className="homepage__thumbnails">
      <Container fluid className="padded">
        <Grid columns='equal'>
          <Grid.Row>
            <Grid.Column><h1>{t(`personal.${namespace}`)}</h1></Grid.Column>
            {seeAll}
          </Grid.Row>
        </Grid>

        <Card.Group itemsPerRow={itemsPerRow} doubling>
          {children}
        </Card.Group>
      </Container>
    </div>
  );
};

Template.propTypes = {
  items: PropTypes.arrayOf(shapes.ContentUnit),
  t: PropTypes.func.isRequired
};

const ItemsByNamespace = ({ pageSize = 8, pageNo = 1, t, namespace, withSeeAll }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetch(namespace, { page_no: pageNo, page_size: pageSize }));
  }, [dispatch, pageNo, pageSize]);

  const hs  = useSelector(state => selectors.getItems(state.my, namespace));
  const err = useSelector(state => selectors.getErr(state.my, namespace));
  const wip = useSelector(state => selectors.getWIP(state.my, namespace));

  const denormLikesHistory  = (state, item) => {
    const unit = mdb.getDenormContentUnit(state.mdb, item.content_unit_uid);
    return { unit, item };
  };
  const denormSubscribtions = (state, item) => {
    const collection = mdb.getDenormCollection(state.mdb, item.collection_uid);
    return { item, collection };
  };
  const denormPlaylist      = (state, item) => {
    const cuid = item.items?.[0]?.content_unit_uid;
    const unit = cuid ? mdb.getDenormContentUnit(state.mdb, cuid) : {};
    return { unit, item };
  };

  const denormItems = hs => state => {
    if (!Array.isArray(hs)) return [];
    return hs.map(x => {
      switch (namespace) {
      case MY_NAMESPACE_LIKES:
      case MY_NAMESPACE_HISTORY:
        return denormLikesHistory(state, x);
      case MY_NAMESPACE_SUBSCRIPTIONS:
        return denormSubscribtions(state, x);
      case MY_NAMESPACE_PLAYLISTS:
        return denormPlaylist(state, x);
      }
      return null;
    });
  };

  const items = useSelector(denormItems(hs));

  if (wip || err || items.length === 0) return WipErr({ wip, err, t });
  let children = null;

  switch (namespace) {
  case MY_NAMESPACE_HISTORY:
    children = items.map(d => <HistoryItem data={d} key={`${namespace}_${d.item.id}`} t={t} />);
    break;
  case MY_NAMESPACE_LIKES:
    children = items.map(d => <LikeItem data={d} key={`${namespace}_${d.item.id}`} t={t} />);
    break;
  case MY_NAMESPACE_PLAYLISTS:
    children = items.map(d => <PlaylistItem data={d} key={`${namespace}_${d.item.id}`} t={t} />);
    break;
  case MY_NAMESPACE_SUBSCRIPTIONS:
    children = items.map(d => <SubscriptionsItem data={d} key={`${namespace}_${d.item.id}`} t={t} />);
    break;
  default:
    break;
  }

  return <Template namespace={namespace} children={children} t={t} withSeeAll={withSeeAll} />;
};

export default withNamespaces()(ItemsByNamespace);

export const RemoveBtn = (remove, message) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg]   = useState(message);

  const onAlertCloseHandler = () => {
    remove();
    setAlertOpen(false);
    setAlertMsg('');
  };

  return (
    <>
      <AlertModal message={alertMsg} open={alertOpen} onClose={onAlertCloseHandler} />
      <Button
        floated={'right'}
        size={'tiny'}
        icon={'remove'}
        onClick={remove}
        color="red"
      />
    </>
  );
};
