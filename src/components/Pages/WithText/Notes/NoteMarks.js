import React, { useEffect, useState } from 'react';
import { textMarksPrefixByType } from '../scrollToSearch/helper';
import { useSelector } from 'react-redux';

import NotesByPos from './NotesByPos';
import { useNodeHighlight } from './useNodeHighlight';
import NotesAllPage from './NotesAllPage';
import { myNotesGetListSelector } from '../../../../redux/selectors';

const idPrefix  = textMarksPrefixByType.note.start;
const NoteMarks = ({ parentTop }) => {
  const [byLine, setByLine] = useState({});
  const ids                 = useSelector(myNotesGetListSelector);

  useNodeHighlight();

  useEffect(() => {
    const _byLine = {};
    ids.forEach(nId => {
      const el = document.getElementById(`${idPrefix}${nId}`);
      if (!el) return;
      const top = Math.round(el.getBoundingClientRect().top - window.scrollY - parentTop);
      let key   = Object.keys(_byLine).find(k => Math.abs(k - top) < 20);
      if (!key) {
        key          = top;
        _byLine[key] = [];
      }

      _byLine[key] = [..._byLine[key], nId];
    });
    setByLine(_byLine);
  }, [ids, parentTop]);

  return (
    <div className="note_marks">
      <NotesAllPage />
      {
        Object.entries(byLine).map(([key, ids]) => <NotesByPos key={key} ids={ids} pos={key} />)
      }
    </div>

  );
};

export default NoteMarks;
