import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import NotesByPos from './NotesByPos';
import { myNotesGetByIdSelector, myNotesGetListSelector, textPageGetFileSelector } from '../../../../redux/selectors';
import { useLocation } from 'react-router-dom';
import { getPageFromLocation } from '../../../Pagination/withPagination';

const NotesAllPage = () => {
  const ids       = useSelector(myNotesGetListSelector);
  const byId      = useSelector(myNotesGetByIdSelector);
  const { isPdf } = useSelector(textPageGetFileSelector);

  const location = useLocation();
  const page     = getPageFromLocation(location);

  const _ids = useMemo(() => ids
    .map(id => byId[id])
    .filter(({ properties: p }) => !isPdf || (!p.page || Number.parseInt(p.page, 10) === page))
    .filter(({ properties: p }) => !p || (!p.srchstart && !p.srchend))
    .map(n => n.id), [byId, ids, page]);

  if (_ids.length === 0) return null;

  return <NotesByPos ids={_ids} pos={0} />;
};

export default NotesAllPage;
