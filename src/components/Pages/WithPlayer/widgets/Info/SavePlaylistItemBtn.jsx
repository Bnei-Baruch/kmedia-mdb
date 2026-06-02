import React, { useReducer } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SaveAsLabel from './SaveAsLabel';
import NeedToLoginModal from './NeedToLoginModal';
import SaveAsPlaylistItem from './SaveAsPlaylistItem';
import { authGetUserSelector } from '../../../../../redux/selectors';

export const ADD_PLAYLIST_ITEM_MODES = {
  'login'   : 'login_mode',
  'playlist': 'playlist_mode',
  'label'   : 'label_mode',
  'none'    : 'none'
};

const reducer = (state, action) => ({ ...state, ...action });

const SavePlaylistItemBtn = ({ label }) => {
  const { t } = useTranslation();

  const user = useSelector(authGetUserSelector);

  const [state, dispatchReact] = useReducer(reducer, { mode: ADD_PLAYLIST_ITEM_MODES.none });

  const handleOpen = () => dispatchReact({ mode: ADD_PLAYLIST_ITEM_MODES.playlist });

  const handleOpenAs = mode => dispatchReact({ mode });

  let modal = '';
  if (!user)
    modal = <NeedToLoginModal/>;

  if (state?.mode === ADD_PLAYLIST_ITEM_MODES.playlist)
    modal = <SaveAsPlaylistItem setModalMode={handleOpenAs} label={label}/>;

  if (state?.mode === ADD_PLAYLIST_ITEM_MODES.label)
    modal = <SaveAsLabel label={label} setModalMode={handleOpenAs}/>;

  return (
    <>
      {modal}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded uppercase"
        onClick={handleOpen}
      >
        {t('buttons.save')}
      </button>
    </>
  );
};

export default SavePlaylistItemBtn;
