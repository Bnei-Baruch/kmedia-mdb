import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { actions } from '../../../../redux/modules/myNotes';
import { textPageGetSubjectSelector, textPageGetFileSelector } from '../../../../redux/selectors';

export const useFetchNotes = () => {
  const subject      = useSelector(textPageGetSubjectSelector);
  const { language } = useSelector(textPageGetFileSelector);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetch({ subject_uid: subject.id, language }));
  }, [subject.id, language]);

  return null;
};
