import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../redux/modules/myNotes';
import NotesByPos from './NotesByPos';

const NotesAllPage = () => {
  const ids  = useSelector(state => selectors.getList(state.myNotes));
  const byId = useSelector(state => selectors.getById(state.myNotes));
  const _ids = useMemo(() => ids
    .map(id => byId[id])
    .filter(({ properties: p }) => !p || (!p.srchstart && !p.srchend))
    .map(n => n.id), [byId, ids]);

  if (_ids.length === 0) return null;

  return <NotesByPos ids={_ids} pos={0} />;
};

export default NotesAllPage;
