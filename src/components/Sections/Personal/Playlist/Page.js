import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Confirm, Container, Divider, Grid, Icon, Table } from 'semantic-ui-react';
import clsx from 'clsx';

import { actions, selectors } from '../../../../redux/modules/my';
import {
  MY_NAMESPACE_PLAYLIST_BY_ID,
  MY_NAMESPACE_PLAYLIST_ITEMS,
  MY_NAMESPACE_PLAYLISTS
} from '../../../../helpers/consts';
import WipErr from '../../../shared/WipErr/WipErr';
import CUItemContainer from '../../../shared/CUItem/CUItemContainer';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import PlaylistHeader from './Header';
import { selectors as settings } from '../../../../redux/modules/settings';
import PlaylistHeaderContainer from './HeaderContainer';

const Page = ({ t }) => {
  const [confirm, setConfirm] = useState();
  const { id }                = useParams();

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const language = useSelector(state => settings.getLanguage(state.settings));
  const playlist = useSelector(state => selectors.getPlaylistById(state.my, id));
  const wip      = useSelector(state => selectors.getWIP(state.my, MY_NAMESPACE_PLAYLIST_BY_ID));

  const err      = useSelector(state => selectors.getErr(state.my, MY_NAMESPACE_PLAYLIST_BY_ID));
  const dispatch = useDispatch();

  useEffect(() => {
    id && dispatch(actions.fetchById(MY_NAMESPACE_PLAYLIST_BY_ID, { id }));
  }, [id, language]);

  if (!playlist) return null;

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;

  const link          = `/${language}/${MY_NAMESPACE_PLAYLISTS}/${playlist.id}`;
  const computerWidth = isMobileDevice ? 16 : 10;
  const items         = [...playlist.playlist_items || []];
  items.sort((a, b) => b.position - a.position);

  const removeItem = (id) => setConfirm(true);

  const changeItemPosition = (i, up) => {
    let { id: cid, position: cp } = items[i];
    let { id: nid, position: np } = up ? items[i - 1] : items[i + 1];
    if (cp === np) {
      np = up ? np + 1 : np - 1;
    }
    dispatch(actions.edit(MY_NAMESPACE_PLAYLIST_ITEMS, { id: cid, position: np }));
    dispatch(actions.edit(MY_NAMESPACE_PLAYLIST_ITEMS, { id: nid, position: cp }));
  };

  const handleConfirmCancel = () => setConfirm(false);

  const handleConfirmSuccess = () => dispatch(actions.remove(MY_NAMESPACE_PLAYLIST_ITEMS, { ids: [id] }));

  return (
    <Grid padded={!isMobileDevice} className="avbox no-background">
      <Grid.Column mobile={16} tablet={computerWidth} computer={computerWidth} className={clsx({ 'is-fitted': isMobileDevice })}>
        <PlaylistHeaderContainer playlist={playlist} />
        {
          items?.length > 0 ? (
            <Table unstackable basic="very" sortable>
              <Table.Body>
                {items.map((x, i) => (
                    <CUItemContainer id={x.content_unit_uid} link={`${link}?ap=${i}`} asList>
                      <div className="my_playlist_actions">
                        <Confirm
                          size="tiny"
                          open={confirm}
                          onCancel={handleConfirmCancel}
                          onConfirm={handleConfirmSuccess}
                          content={t('personal.confirmRemovePlaylistItem', {cu: x.name, playlist: playlist.name})}
                        />
                        <div>
                          <Button
                            basic
                            icon="long arrow alternate up"
                            className="no-shadow"
                            disabled={i === 0}
                            onClick={() => changeItemPosition(i, true)}
                          />
                          <Button
                            basic
                            icon="remove circle"
                            className="no-shadow"
                            onClick={() => removeItem(x.id)}
                          />
                          <Button
                            basic
                            icon="long arrow alternate down"
                            className="no-shadow"
                            disabled={i === items.length - 1}
                            onClick={() => changeItemPosition(i, false)}
                          />
                        </div>
                      </div>
                    </CUItemContainer>
                  )
                )}
              </Table.Body>
            </Table>) : null
        }
      </Grid.Column>
      {
        !isMobileDevice && <Grid.Column mobile={16} tablet={6} computer={6} />
      }
    </Grid>
  );
};

export default withNamespaces()(withRouter(Page));
