import React, { useReducer } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { selectors as auth } from '../../../../../redux/modules/auth';
import { useTranslation } from 'react-i18next';
import SaveAsLabel from './SaveAsLabel';
import NeedToLoginModal from './NeedToLoginModal';
import SaveAsPlaylistItem from './SaveAsPlaylistItem';

export const ADD_PLAYLIST_ITEM_MODES = {
  'login': 'login_mode',
  'playlist': 'playlist_mode',
  'label': 'label_mode',
  'none': 'none',
};

const reducer = (state, action) => ({ ...state, ...action });

const SavePlaylistItemBtn = ({ label }) => {
  const { t } = useTranslation();

  const user = useSelector(state => auth.getUser(state.auth));

  const [state, dispatchReact] = useReducer(reducer, { mode: ADD_PLAYLIST_ITEM_MODES.none });

  const handleOpen = () => dispatchReact({ mode: ADD_PLAYLIST_ITEM_MODES.playlist });

  const handleOpenAs = mode => dispatchReact({ mode });

  let modal = '';
  if (!user)
    modal = <NeedToLoginModal />;

  if (state?.mode === ADD_PLAYLIST_ITEM_MODES.playlist)
    modal = <SaveAsPlaylistItem setModalMode={handleOpenAs} label={label} />;

  if (state?.mode === ADD_PLAYLIST_ITEM_MODES.label)
    modal = <SaveAsLabel label={label} setModalMode={handleOpenAs} />;

  return (
    <>
      {modal}
      <Button
        primary
        content={t('buttons.save')}
        onClick={handleOpen}
        className="uppercase"
      />
    </>
  );
};

export default SavePlaylistItemBtn;
