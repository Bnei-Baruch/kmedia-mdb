import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

import NoteMarkInList from './NoteMarkInList';
import {
  textPageGetSettings,
  myNotesGetByIdSelector,
  textPageGetSideOffsetSelector
} from '../../../../redux/selectors';
import { useClickOutside } from '../../../shared/useClickOutside';

const NotesByPos = ({ pos, ids }) => {
  const [open, setOpen]   = useState(false);
  const [isOut, setIsOut] = useState(true);

  const byId         = useSelector(myNotesGetByIdSelector);
  const { zoomSize } = useSelector(textPageGetSettings);
  const offset       = useSelector(textPageGetSideOffsetSelector);

  const ref = useRef();

  const handleClose = () => setOpen(false);
  useClickOutside(handleClose, [ref]);

  const notes = useMemo(() => ids
    .map(id => byId[id])
    .map(n => ({ type: 'note', ...n }))
  , [byId, ids]);

  useEffect(() => {
    setIsOut(370 * zoomSize < offset);
  }, [zoomSize, offset]);

  const handleToggle = () => setOpen(!open);

  return (
    <div className="note_mark" style={{ top: `${pos}px` }} ref={ref}>
      <button
        className="clear_button position_relative"
        onClick={handleToggle}
      >
        <span className="material-symbols-outlined">mode_comment</span>
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {ids.length}
        </span>
      </button>
      {
        open && (
          <div className={clsx('note_list', { 'note_list_out': isOut })}>
            {notes.map(n => <NoteMarkInList note={n} key={n.id} />)}
          </div>
        )
      }
    </div>

  );
};

export default NotesByPos;
