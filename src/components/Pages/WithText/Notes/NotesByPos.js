import React, { useState, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Label, Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../redux/modules/myNotes';
import { selectors as textPage } from '../../../../redux/modules/textPage';
import NoteItemInList from './NoteItemInList';
import { stopBubbling, noop } from '../../../../helpers/utils';
import { textMarksPrefixByType } from '../scrollToSearch/helper';
import { selectByPrefixAndId } from '../helper';
import clsx from 'clsx';

const idPrefixes = textMarksPrefixByType.note;
const NotesByPos = ({ pos, ids }) => {
  const [open, setOpen]   = useState(true);
  const [isOut, setIsOut] = useState(true);

  const getById      = useSelector(state => selectors.getById(state.notes));
  const expandAll    = useSelector(state => textPage.getExpandNotes(state.textPage));
  const { zoomSize } = useSelector(state => textPage.getSettings(state.textPage));
  const offset       = useSelector(state => textPage.getSideOffset(state.textPage));

  const ref = useRef();

  const notes = useMemo(() => ids
      .map(id => getById[id])
      .map(n => ({ type: 'note', ...n }))
    , [getById, ids]);

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

  const handleToggle = () => {
    setOpen(!open);
    if (!open) {
      selectByPrefixAndId(idPrefixes, ids[0]);
    }
  };

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
            {notes.map(n => <NoteItemInList note={n} key={n.id} />)}
          </div>
        )
      }
    </div>

  );
};

export default NotesByPos;
