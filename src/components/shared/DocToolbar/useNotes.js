import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors, actions } from '../../../redux/modules/myNotes';
import { buildOffsets } from './helper';

export const useNotes = (subject_uid, language) => {
  const ids   = useSelector(state => selectors.getList(state.notes));
  const notes = useSelector(state => ids
    .map(id => selectors.getById(state.notes, id))
    .filter(l => (l.language === language))
    .map(n => ({ type: 'note', ...n }))
  ) || [];

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetch({ subject_uid, language }));
  }, [subject_uid, language]);

  const offsets = buildOffsets(notes);

  return { notes, offsets };
};
