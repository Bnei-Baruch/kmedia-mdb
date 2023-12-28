import React, { useEffect, useState } from 'react';
import { textMarksPrefixByType } from '../scrollToSearch/helper';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../redux/modules/myNotes';
import NotesByPos from './NotesByPos';
import { isEmpty } from '../../../../helpers/utils';

const idPrefix  = textMarksPrefixByType.note.start;
const NoteMarks = ({ parentTop }) => {
  const [byLine, setByLine] = useState({});
  const ids                 = useSelector(state => selectors.getList(state.notes));

  useEffect(() => {
    const _byLine = {};
    ids.map(nId => {
      const el = document.getElementById(`${idPrefix}${nId}`);
      if (!el) return;
      const top = el.getBoundingClientRect().top - window.scrollY - parentTop;
      let key   = Object.keys(_byLine).find(k => Math.abs(k - top) < 20);
      if (!key) {
        key          = top;
        _byLine[key] = [];
      }

      _byLine[key] = [..._byLine[key], nId];
    });
    setByLine(_byLine);
  }, [ids]);

  return (
    <div className="note_marks">
      {
        Object.entries(byLine).map(([key, ids]) => <NotesByPos key={key} ids={ids} pos={key} />)
      }
    </div>

  );
};

export default NoteMarks;
