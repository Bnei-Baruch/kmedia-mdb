import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { actions } from '../../../../redux/modules/myNotes';
import {
  textPageGetSubjectSelector,
  textPageGetFileSelector,
  myNotesGetListSelector,
  myNotesGetByIdSelector
} from '../../../../redux/selectors';

export const useNotes = () => {
  const subject      = useSelector(textPageGetSubjectSelector);
  const { language } = useSelector(textPageGetFileSelector);
  const ids          = useSelector(myNotesGetListSelector);
  const byId         = useSelector(myNotesGetByIdSelector);
  const notes        = useMemo(() => ids.map(id => byId[id]).map(n => ({ type: 'note', ...n })), [byId, ids]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetch({ subject_uid: subject.id, language }));
  }, [subject.id, language]);

  return notes;
};
