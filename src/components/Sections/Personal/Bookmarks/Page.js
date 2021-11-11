import React, { useContext } from 'react';
import { withRouter } from 'react-router';
import { Button, Container, Grid, Header, Icon } from 'semantic-ui-react';
import clsx from 'clsx';

import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import BookmarksContainer from './Bookmarks/Container';
import { useSelector } from 'react-redux';
import { selectors as auth } from '../../../../redux/modules/auth';
import NeedToLogin from '../NeedToLogin';
import WipErr from '../../../shared/WipErr/WipErr';
import { withNamespaces } from 'react-i18next';
import FoldersContainer from './Folders/Container';

const Page = ({ t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const needToLogin = NeedToLogin({ t });
  if (needToLogin) return needToLogin;

  return (
    <Grid padded={!isMobileDevice}>
      <Grid.Row>
        <Grid.Column mobile={16} tablet={5} computer={5}>
          <FoldersContainer />
        </Grid.Column>
        <Grid.Column mobile={16} tablet={11} computer={11} className={clsx({ 'is-fitted': isMobileDevice })}>
          <Container className="padded">
            <BookmarksContainer />
          </Container>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default withNamespaces()(Page);
