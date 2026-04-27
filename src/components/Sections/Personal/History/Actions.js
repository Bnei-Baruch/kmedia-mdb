import React, { useState, useRef, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { actions } from '../../../../redux/modules/my';
import { MY_NAMESPACE_HISTORY } from '../../../../helpers/consts';
import PlaylistInfo from '../../../Pages/WithPlayer/widgets/Info/SavePlaylistItemBtn';
import { getMyItemKey } from '../../../../helpers/my';
import { stopBubbling } from '../../../../helpers/utils';

const Actions = ({ history, t }) => {
  const [open, setOpen]          = useState();
  const dispatch                 = useDispatch();
  const menuRef                  = useRef(null);
  const { id, content_unit_uid } = history;
  const { key }                  = getMyItemKey(MY_NAMESPACE_HISTORY, history);

  const removeItem = e => {
    stopBubbling(e);
    dispatch(actions.remove(MY_NAMESPACE_HISTORY, { id, key }));
  };

  const handleOpen = e => {
    stopBubbling(e);
    setOpen(true);
  };

  const handleClose = e => {
    if (e) stopBubbling(e);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        handleClose();
      }
    };

    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block cu_item_dropdown" ref={menuRef}>
      <button className="p-1" onClick={open ? handleClose : handleOpen}>
        <span className="material-symbols-outlined">more_vert</span>
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-48 rounded border border-gray-200 bg-white shadow-lg">
          <div className="px-4 py-2">
            <PlaylistInfo cuID={content_unit_uid} t={t} handleClose={handleClose}/>
          </div>
          <button
            className="flex w-full items-center gap-2 px-4 py-2 text-left small hover:bg-gray-100"
            onClick={removeItem}
          >
            <span className="material-symbols-outlined text-base">cancel</span>
            {t('personal.removeHistory')}
          </button>
        </div>
      )}
    </div>
  );
};

export default withTranslation()(Actions);
