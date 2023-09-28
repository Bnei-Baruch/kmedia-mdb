import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors, myNotesSlice } from '../../../../lib/redux/slices/mySlice/myNotesSlice';
import { buildOffsets } from './helper';
import { fetchNotes } from '../../../../lib/redux/slices/mySlice/thunks';

export const useNotes = (subject_uid, language) => {
  const ids   = useSelector(state => selectors.getList(state.notes));
  const notes = useSelector(state => ids
    .map(id => selectors.getById(state.notes, id))
    .map(n => ({ type: 'note', ...n }))
  ) || [];

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchNotes({ subject_uid, language }));
  }, [subject_uid, language]);

  const offsets = buildOffsets(notes);

  return { notes, offsets };
};
