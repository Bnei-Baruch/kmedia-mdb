import React from 'react';
import { withNamespaces } from 'react-i18next';
import { Container, List } from 'semantic-ui-react';
import BookmarksItem from './Item';
import { shallowEqual, useSelector } from 'react-redux';
import { selectors } from '../../../../../redux/modules/sources';

const BookmarksList = ({ items }) => {
  const getSourceById = useSelector(state => selectors.getSourceById(state.sources), shallowEqual);

  return (
    <Container>
      <List divided relaxed>
        {items.map(x => <BookmarksItem bookmark={x} getSourceById={getSourceById} />)}
      </List>
    </Container>
  );
};
export default withNamespaces()(BookmarksList);
