import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import NotesByPos from './NotesByPos';
import { myNotesGetByIdSelector, myNotesGetListSelector } from '../../../../redux/selectors';

const NotesAllPage = () => {
  const ids  = useSelector(myNotesGetListSelector);
  const byId = useSelector(myNotesGetByIdSelector);
  const _ids = useMemo(() => ids
    .map(id => byId[id])
    .filter(({ properties: p }) => !p || (!p.srchstart && !p.srchend))
    .map(n => n.id), [byId, ids]);

  if (_ids.length === 0) return null;

  return <NotesByPos ids={_ids} pos={0} />;
};

export default NotesAllPage;
