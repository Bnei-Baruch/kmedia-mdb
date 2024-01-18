import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Button, Label } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../redux/modules/myNotes';
import { selectors as textPage } from '../../../../redux/modules/textPage';
import NoteMarkInList from './NoteMarkInList';
import clsx from 'clsx';
import {
  textPageGetSettings,
  textPageGetExpandNotesSelector,
  myNotesGetByIdSelector, textPageGetSideOffsetSelector
} from '../../../../redux/selectors';

const NotesByPos = ({ pos, ids }) => {
  const [open, setOpen]   = useState(true);
  const [isOut, setIsOut] = useState(true);

  const byId         = useSelector(myNotesGetByIdSelector);
  const expandAll    = useSelector(textPageGetExpandNotesSelector);
  const { zoomSize } = useSelector(textPageGetSettings);
  const offset       = useSelector(textPageGetSideOffsetSelector);

  const ref = useRef();

  const notes = useMemo(() => ids
    .map(id => byId[id])
    .map(n => ({ type: 'note', ...n }))
  , [byId, ids]);

  useEffect(() => {
    const handleClose = e => {
      if (!(ref.current.contains(e.target))) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClose);
    return () => document.removeEventListener('click', handleClose);
  }, [ref.current]);

  useEffect(() => {
    setOpen(expandAll);
  }, [expandAll]);

  useEffect(() => {
    setIsOut(370 * zoomSize < offset);
  }, [zoomSize, offset]);

  const handleToggle = () => setOpen(!open);

  return (
    <div className="note_mark" style={{ top: `${pos}px` }} ref={ref}>
      <Button
        basic
        className="clear_button position_relative"
        onClick={handleToggle}
      >
        <span className="material-symbols-outlined">mode_comment</span>
        <Label floating circular>
          {ids.length}
        </Label>
      </Button>
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
