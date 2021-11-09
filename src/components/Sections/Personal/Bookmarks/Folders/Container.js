import React, { useCallback, useContext, useEffect } from 'react';
import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ListItem } from 'semantic-ui-react';

const Container = ({ location, t }) => (
  <List>
    <ListItem>asdasd</ListItem>
  </List>
);

export default withNamespaces()(withRouter(Container));
