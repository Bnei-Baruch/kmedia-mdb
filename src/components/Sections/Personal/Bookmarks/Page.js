import React, { useContext } from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';
import clsx from 'clsx';

import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import BookmarkList from './Bookmarks/List';
import NeedToLogin from '../NeedToLogin';
import { withNamespaces } from 'react-i18next';
import FolderList from './Folders/List';
import BookmarkHeader from './Header';
import BookmarkHeaderMobile from './HeaderMobile';

const Page = ({ t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const needToLogin = NeedToLogin({ t });
  if (needToLogin) return needToLogin;

  return (
    <Container fluid className="padded">
      {isMobileDevice && <BookmarkHeaderMobile />}
      <Grid className="no-padding">
        {!isMobileDevice && <BookmarkHeader />}
        <Grid.Row>
          {!isMobileDevice && <FolderList />}
          <Grid.Column mobile={16} tablet={12} computer={12}>
            <Segment
              className={clsx({
                'padded': !isMobileDevice,
                'no-padding': isMobileDevice
              })}
              basic={isMobileDevice}
            >
              <BookmarkList />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default withNamespaces()(Page);
