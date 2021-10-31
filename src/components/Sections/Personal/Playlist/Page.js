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
import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import WipErr from '../../../shared/WipErr/WipErr';
import CUItemContainer from '../../../shared/CUItem/CUItemContainer';
import AlertModal from '../../../shared/AlertModal';
import PlaylistHeaderContainer from './HeaderContainer';
import NeedToLogin from '../NeedToLogin';
import { getMyItemKey } from '../../../../helpers/my';
import { FrownSplash } from '../../../shared/Splash/Splash';

const Page = ({ t }) => {
  const { id } = useParams();

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { key }            = getMyItemKey(MY_NAMESPACE_PLAYLISTS, { id });
  const language           = useSelector(state => settings.getLanguage(state.settings));
  const playlist           = useSelector(state => selectors.getItemByKey(state.my, MY_NAMESPACE_PLAYLISTS, key));
  const wip                = useSelector(state => selectors.getWIP(state.my, MY_NAMESPACE_PLAYLISTS));
  const err                = useSelector(state => selectors.getErr(state.my, MY_NAMESPACE_PLAYLISTS));
  const deleted            = useSelector(state => selectors.getDeleted(state.my, MY_NAMESPACE_PLAYLISTS));
  const user               = useSelector(state => auth.getUser(state.auth));
  const dispatch           = useDispatch();

  useEffect(() => {
    id && dispatch(actions.fetchOne(MY_NAMESPACE_PLAYLISTS, { id }));
  }, [id, language, user, dispatch]);


  const needToLogin = NeedToLogin({ t });
  if (needToLogin) return needToLogin;

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;

  if (!playlist) return null;

  const link          = `/${language}/${MY_NAMESPACE_PLAYLISTS}/${id}`;
  const computerWidth = isMobileDevice ? 16 : 10;
  const items         = [...playlist.items || []];
  items.sort((a, b) => b.position - a.position);

  const removeItem = (e, piID) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(actions.remove(MY_NAMESPACE_PLAYLISTS, { id, ids: [piID], changeItems: true }));
  };

  const onAlertCloseHandler = () => dispatch(actions.setDeleted(MY_NAMESPACE_PLAYLISTS, false));

  const changeItemPosition = (e, i, up) => {
    e.preventDefault();
    e.stopPropagation();
    const currentItem = items[i];
    const nextItem    = up ? items[i - 1] : items[i + 1];
    let cp, np;
    if (currentItem.position === nextItem.position) {
      cp = up ? currentItem.position + 1 : currentItem.position - 1;
      np = nextItem.position;
    } else {
      np = currentItem.position;
      cp = nextItem.position;
    }

    const _items = [{ ...currentItem, position: cp || 1 }, { ...nextItem, position: np || 1 }];
    dispatch(actions.edit(MY_NAMESPACE_PLAYLISTS, { id, items: _items, changeItems: true }));
  };

  const renderItem = (x, i) => (
    <CUItemContainer
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
    </CUItemContainer>
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
            ) : <FrownSplash text={t('messages.not-found')} />
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
