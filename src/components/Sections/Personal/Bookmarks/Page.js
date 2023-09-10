import React, { useContext } from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';
import clsx from 'clsx';

import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import BookmarkList from './Bookmarks/List';
import NeedToLogin from '../NeedToLogin';
import { withTranslation } from 'next-i18next';
import FolderList from './Folders/List';
import BookmarkHeader from './Header';
import BookmarkHeaderMobile from './HeaderMobile';

const Page = ({ t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const needToLogin = NeedToLogin({ t });
  if (needToLogin) return needToLogin;

  return (
    <Container fluid className={clsx('padded bookmark_page', {
      'padded': !isMobileDevice,
      'no-padding': isMobileDevice
    })}
    >
      {isMobileDevice && <BookmarkHeaderMobile />}
      <Grid className={clsx({ 'no-margin': isMobileDevice })}>
        {!isMobileDevice && <BookmarkHeader />}
        <Grid.Row>
          {!isMobileDevice && <FolderList />}
          <Grid.Column
            mobile={16}
            tablet={12}
            computer={12}
            className={clsx({ 'no-margin, no-padding': isMobileDevice })}
          >
            <Segment basic={isMobileDevice}>
              <BookmarkList />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default withTranslation()(Page);
