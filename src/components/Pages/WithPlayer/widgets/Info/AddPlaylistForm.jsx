import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { actions } from '../../../../../redux/modules/my';
import { MY_NAMESPACE_PLAYLIST_EDIT } from '../../../../../helpers/consts';
import AlertModal from '../../../../shared/AlertModal';
import { stopBubbling } from '../../../../../helpers/utils';
import { useTranslation } from 'react-i18next';

const AddPlaylistForm = ({ close }) => {
  const { t } = useTranslation();

  const [alertMsg, setAlertMsg] = useState();
  const [name, setName]         = useState('');

  const dispatch = useDispatch();

  const handleSaveNewPlaylist = e => {
    stopBubbling(e);
    dispatch(actions.add(MY_NAMESPACE_PLAYLIST_EDIT, { name }));
    setAlertMsg(t('personal.newPlaylistSuccessful', { name }));
  };

  const onAlertCloseHandler = () => {
    setAlertMsg(null);
    close();
  };

  const handleNameChange = e => setName(e.target.value);

  return (
    <>
      <AlertModal message={alertMsg} open={!!alertMsg} onClose={onAlertCloseHandler} />
      <li key="playlist_form" className="flex items-center gap-2 py-1">
        <div className="flex-1">
          <input
            className="w-full border rounded px-2 py-1 border-gray-300"
            type="text"
            maxLength={30}
            onChange={handleNameChange}
            placeholder={t('personal.newPlaylistName')}
          />
        </div>
        <div className="flex gap-1">
          <button
            className="bg-green-600 text-white px-2 py-1 rounded text-xl disabled:opacity-30"
            onClick={handleSaveNewPlaylist}
            disabled={!name}
          >
            <span className="material-symbols-outlined small">check</span>
          </button>
          <button
            className="px-2 py-1 rounded text-xl bg-gray-300"
            onClick={close}
          >
            <span className="material-symbols-outlined small">close</span>
          </button>
        </div>
      </li>
    </>
  );
};

export default AddPlaylistForm;
