import React from 'react';
import { withNamespaces } from 'react-i18next';
import { Container, List } from 'semantic-ui-react';
import BookmarksItem from './Item';
import { shallowEqual, useSelector } from 'react-redux';
import { selectors } from '../../../../../redux/modules/sources';
import { MY_NAMESPACE_BOOKMARKS } from '../../../../../helpers/consts';

const BookmarksList = ({ items }) => {
  const getSourceById = useSelector(state => selectors.getSourceById(state.sources), shallowEqual);

  return (
    <Container>
      <List divided relaxed celled>
        {items.map(x => (
            <BookmarksItem
              bookmark={x}
              getSourceById={getSourceById}
              key={`${MY_NAMESPACE_BOOKMARKS}_${x.id}`}
            />
          )
        )}
      </List>
    </Container>
  );
};

export default withNamespaces()(BookmarksList);
