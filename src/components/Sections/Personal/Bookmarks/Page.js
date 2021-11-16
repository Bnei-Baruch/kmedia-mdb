import React, { useContext } from 'react';
import { Grid, Header, Icon, Input, Segment } from 'semantic-ui-react';
import clsx from 'clsx';

import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import BookmarkList from './Bookmarks/List';
import NeedToLogin from '../NeedToLogin';
import { withNamespaces } from 'react-i18next';
import FolderList from './Folders/List';
import BookmarkHeader from './Bookmarks/Header';

const Page = ({ t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const needToLogin = NeedToLogin({ t });
  if (needToLogin) return needToLogin;

  return (
    <Grid padded={!isMobileDevice}>

      <Grid.Row verticalAlign="bottom">
        <Grid.Column mobile={16} tablet={4} computer={4}>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={12} computer={12} className={clsx({ 'is-fitted': isMobileDevice })}
        >
          <BookmarkHeader />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column mobile={16} tablet={4} computer={4}>
          <FolderList />
        </Grid.Column>
        <Grid.Column mobile={16} tablet={12} computer={12} className={clsx({ 'is-fitted': isMobileDevice })}>
          <Segment className="padded">
            <BookmarkList />
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default withNamespaces()(Page);
