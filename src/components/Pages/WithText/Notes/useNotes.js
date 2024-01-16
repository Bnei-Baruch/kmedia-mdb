import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors, actions } from '../../../../redux/modules/myNotes';
import { selectors as textPage } from '../../../../redux/modules/textPage';

export const useNotes = () => {
  const { id } = useSelector(state => textPage.getSubject(state.textPage));
  const { language } = useSelector(state => textPage.getFile(state.textPage));
  const ids      = useSelector(state => selectors.getList(state.myNotes));
  const byId     = useSelector(state => selectors.getById(state.myNotes));
  const notes    = useMemo(() => ids.map(id => byId[id]).map(n => ({ type: 'note', ...n })), [byId, ids]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetch({ subject_uid: id, language }));
  }, [id, language]);

  return notes;
};
