import React, { useContext, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { parentTypeByIndex } from './helper';
import { useDispatch, useSelector } from 'react-redux';
import { actions as listsActions, selectors as lists } from '../../redux/modules/lists';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import ContentItemContainer from '../shared/ContentItem/ContentItemContainer';
import { Grid, Header, Segment } from 'semantic-ui-react';

const ResultIntent = ({ hit, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const { _index, _type: contentType, _source: { mdb_uid: mdbUid, } } = hit;

  const namespace = `intents_${mdbUid}_${contentType}`;

  const { items = [] } = useSelector(state => lists.getNamespaceState(state.lists, namespace));

  const dispatch = useDispatch();
  useEffect(() => {
    const params = {
      content_type: contentType,
      page_size: isMobileDevice ? 4 : 6,
      [parentTypeByIndex(_index)]: mdbUid
    };
    dispatch(listsActions.fetchList(namespace, 1, params));
  }, []);

  const renderItem = (cuID) => {
    return (
      <Grid.Column width="5">
        <ContentItemContainer id={cuID} asList={true} size="small" withCCUInfo />
      </Grid.Column>
    );
  };

  const { rows } = items.reduce((acc, x, i) => {
    if (i !== 0 && (i % 2 === 0 || i === (items.length))) {
      acc.rows.push(
        <Grid.Row>
          {[x, ...acc.cols].map(renderItem)}
        </Grid.Row>
      );
      return { rows: acc.rows, cols: [] };
    } else {
      acc.cols.push(x);
      return acc;
    }
  }, { cols: [], rows: [] });

  return (
    <Segment>
      <Header as="h3" content={t(`search.${contentType}`)} />
      <Grid>
        {rows}
      </Grid>
    </Segment>
  );
};

export default withNamespaces()(ResultIntent);
