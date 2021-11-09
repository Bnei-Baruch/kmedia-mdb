import React from 'react';
import { withNamespaces } from 'react-i18next';
import { Container, List } from 'semantic-ui-react';
import BookmarksItem from './Item';

const BookmarksList = ({ items }) => (
  <Container>
    <List divided relaxed>
      {items.map(x => <BookmarksItem bookmark={x} />)}
    </List>
  </Container>
);

export default withNamespaces()(BookmarksList);
