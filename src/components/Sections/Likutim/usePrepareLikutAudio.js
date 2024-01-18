import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as textPage } from '../../../redux/modules/textPage';
import { selectors, actions } from '../../../redux/modules/assets';
import { textPageGetSubjectSelector, textPageGetFileSelector, textPageGetMP3Selector } from '../../../redux/selectors';

export const usePrepareLikutAudio = () => {
  const url          = useSelector(textPageGetMP3Selector);
  const { id }       = useSelector(textPageGetSubjectSelector);
  const { language } = useSelector(textPageGetFileSelector);
  const status       = useSelector(state => selectors.getMergeStatus(state.assets)(id, language));

  const dispatch = useDispatch();
  useEffect(() => {
    if (!url && !status && id) {
      dispatch(actions.mergeKiteiMakor({ id, language }));
    }
  }, [url, id, language, status]);

  return null;
};
