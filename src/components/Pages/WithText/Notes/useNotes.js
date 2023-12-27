import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors, actions } from '../../../../redux/modules/myNotes';
import { selectors as textPage } from '../../../../redux/modules/textPage';

export const useNotes = () => {
  const id       = useSelector(state => textPage.getSubject(state.textPage).id);
  const language = useSelector(state => textPage.getFile(state.textPage).language);
  const ids      = useSelector(state => selectors.getList(state.notes));
  const getById  = useSelector(state => selectors.getById(state.notes, id));
  const notes    = useMemo(() => ids.map(id => getById[id]).map(n => ({ type: 'note', ...n })), [getById, ids]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetch({ subject_uid: id, language }));
  }, [id, language]);

  return notes;
};
