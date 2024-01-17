import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as textPage } from '../../../redux/modules/textPage';
import { selectors, actions } from '../../../redux/modules/assets';

export const usePrepareLikutAudio = () => {
  const url          = useSelector(state => textPage.getMP3(state.textPage));
  const { id }       = useSelector(state => textPage.getSubject(state.textPage));
  const { language } = useSelector(state => textPage.getFile(state.textPage));
  const status       = useSelector(state => selectors.getMergeStatus(state.assets)(id, language));

  const dispatch = useDispatch();
  useEffect(() => {
    if (!url && !status && id) {
      dispatch(actions.mergeKiteiMakor({ id, language }));
    }
  }, [url, id, language, status]);

  return null;
};
