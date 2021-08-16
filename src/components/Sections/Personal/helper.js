import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Container, Button, Grid } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import { withNamespaces } from 'react-i18next';
import Link from '../../Language/MultiLanguageLink';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../redux/modules/my';
import { selectors as mdb } from '../../../redux/modules/mdb';
import WipErr from '../../shared/WipErr/WipErr';
import { MY_NAMESPACE_HISTORY, MY_NAMESPACE_LIKES, MY_NAMESPACE_PLAYLISTS } from '../../../helpers/consts';
import { HistoryItem } from './History/HistoryItem';
import { LikeItem } from './Like/LikeItem';

const Template = ({ children, namespace, t }) => {
  const itemsPerRow = 4;

  return (
    <div className="homepage__thumbnails">
      <Container fluid className="padded">
        <Grid columns='equal'>
          <Grid.Row>
            <Grid.Column><h1>{t(`my.${namespace}`)}</h1></Grid.Column>
            <Grid.Column>
              <Link to={`/personal/${namespace}`}>
                <Button floated='right' basic color='blue'>
                  {t('search.showAll')}
                </Button>
              </Link>
            </Grid.Column>
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

const ItemsByNamespace = ({ pageSize = 8, pageNo = 1, t, namespace }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetch(namespace, { page_no: pageNo, page_size: pageSize }));
  }, [dispatch, pageNo, pageSize]);

  const hs  = useSelector(state => selectors.getItems(state.my, namespace));
  const err = useSelector(state => selectors.getErr(state.my, namespace));
  const wip = useSelector(state => selectors.getWIP(state.my, namespace));

  const denormItems = hs => state => {
    if (!Array.isArray(hs)) return [];
    return hs.map(x => {
      const unit = mdb.getDenormContentUnit(state.mdb, x.content_unit_uid);
      return { mdbItem: unit, item: x };
    });
  };

  const items = useSelector(denormItems(hs));

  if (wip || err || items.length === 0) return WipErr({ wip, err, t });
  let children = null;

  switch (namespace) {
  case MY_NAMESPACE_HISTORY:
    children = items.map(d => <HistoryItem data={d} key={d.mdbItem.id} t={t} />);
    break;
  case MY_NAMESPACE_LIKES:
    children = items.map(d => <LikeItem data={d} key={d.mdbItem.id} t={t} />);
    break;
  case MY_NAMESPACE_PLAYLISTS:
    children = items.map(d => <LikeItem data={d} key={d.mdbItem.id} t={t} />);
    break;
  default:
    break;
  }

  return <Template namespace={namespace} children={children} t={t} />;
};

export default withNamespaces()(ItemsByNamespace);
