import React, { useContext, useEffect } from 'react';
import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Grid, Popup } from 'semantic-ui-react';
import clsx from 'clsx';

import { actions, selectors } from '../../../../redux/modules/my';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { selectors as settings } from '../../../../redux/modules/settings';
import { selectors as auth } from '../../../../redux/modules/auth';
import {
  MY_NAMESPACE_PLAYLIST_BY_ID,
  MY_NAMESPACE_PLAYLIST_ITEMS,
  MY_NAMESPACE_PLAYLISTS
} from '../../../../helpers/consts';
import WipErr from '../../../shared/WipErr/WipErr';
import ContentItemContainer from '../../../shared/ContentItem/ContentItemContainer';
import AlertModal from '../../../shared/AlertModal';
import PlaylistHeaderContainer from './HeaderContainer';
import NeedToLogin from '../NeedToLogin';

const Page = ({ t }) => {
  const { id } = useParams();

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const language = useSelector(state => settings.getLanguage(state.settings));
  const playlist = useSelector(state => selectors.getPlaylistById(state.my, id));
  const wip      = useSelector(state => selectors.getWIP(state.my, MY_NAMESPACE_PLAYLIST_BY_ID));
  const err      = useSelector(state => selectors.getErr(state.my, MY_NAMESPACE_PLAYLIST_BY_ID));
  const deleted  = useSelector(state => selectors.getDeleted(state.my, MY_NAMESPACE_PLAYLIST_ITEMS));
  const user     = useSelector(state => auth.getUser(state.auth));
  const dispatch = useDispatch();

  useEffect(() => {
    id && dispatch(actions.fetchById(MY_NAMESPACE_PLAYLIST_BY_ID, { id }));
  }, [id, language, user, dispatch]);

  const needToLogin = NeedToLogin({ t });
  if (needToLogin) return needToLogin;

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;

  if (!playlist) return null;

  const link          = `/${language}/${MY_NAMESPACE_PLAYLISTS}/${playlist.id}`;
  const computerWidth = isMobileDevice ? 16 : 10;
  const items         = [...playlist.playlist_items || []];
  items.sort((a, b) => b.position - a.position);

  const removeItem = (e, iID) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(actions.remove(MY_NAMESPACE_PLAYLIST_ITEMS, { ids: [iID] }));
  };

  const onAlertCloseHandler = () => dispatch(actions.setDeleted(MY_NAMESPACE_PLAYLIST_ITEMS, false));

  const changeItemPosition = (e, i, up) => {
    e.preventDefault();
    e.stopPropagation();
    // eslint-disable-next-line prefer-const
    let { id: cid, position: cp } = items[i];
    // eslint-disable-next-line prefer-const
    let { id: nid, position: np } = up ? items[i - 1] : items[i + 1];
    if (cp === np) {
      np = up ? np + 1 : np - 1;
    }

    dispatch(actions.edit(MY_NAMESPACE_PLAYLIST_ITEMS, { id: cid, position: np }));
    dispatch(actions.edit(MY_NAMESPACE_PLAYLIST_ITEMS, { id: nid, position: cp }));
  };

  const renderItem = (x, i) => (
    <ContentItemContainer
      id={x.content_unit_uid}
      key={i}
      link={`${link}?ap=${i}`}
      asList
    >
      <div className="my_playlist_actions">
        <Button
          basic
          icon="long arrow alternate up"
          className="no-shadow"
          disabled={i === 0}
          onClick={e => changeItemPosition(e, i, true)}
        />
        <Popup
          basic
          content={t('personal.removeFromPlaylist')}
          trigger={
            <Button
              basic
              icon="remove circle"
              className="no-shadow"
              onClick={e => removeItem(e, x.id)}
            />
          }>
        </Popup>
        <Button
          basic
          icon="long arrow alternate down"
          className="no-shadow"
          disabled={i === items.length - 1}
          onClick={e => changeItemPosition(e, i, false)}
        />
      </div>
    </ContentItemContainer>
  );

  return (
    <Grid className="avbox no-background">
      <Grid.Row>
        <Grid.Column mobile={16} tablet={computerWidth} computer={computerWidth} className={clsx({ 'is-fitted': isMobileDevice })}>
          <PlaylistHeaderContainer playlist={playlist} />
          <AlertModal message={t('personal.removedSuccessfully')} open={deleted} onClose={onAlertCloseHandler} />
          {
            items?.length > 0 ? (
              <Container className="padded">
                {items.map(renderItem)}
              </Container>
            ) : null
          }
        </Grid.Column>
        {
          !isMobileDevice && <Grid.Column mobile={16} tablet={6} computer={6} />
        }
      </Grid.Row>
    </Grid>
  );
};

export default withNamespaces()(withRouter(Page));
