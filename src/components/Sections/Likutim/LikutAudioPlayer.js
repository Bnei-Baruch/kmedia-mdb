import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AudioPlayer from '../../shared/AudioPlayer';
import { actions, selectors } from '../../../../lib/redux/slices/assetSlice/assetSlice';
import { assetUrl } from '../../../helpers/Api';
import { selectors as textFile } from '../../../../lib/redux/slices/textFileSlice/textFileSlice';
import { mergeKiteiMakor } from '../../../../lib/redux/slices/assetSlice';

const LikutAudioPlayer = ({ file }) => {
  const { id, language } = useSelector(state => textFile.getSubjectInfo(state.textFile));
  const status           = useSelector(state => selectors.getMergeStatus(state.assets)(id, language));
  const dispatch         = useDispatch();

  useEffect(() => {
    if (!file && !status) {
      dispatch(mergeKiteiMakor({ id, language }));
    }
  }, [file, id, language, status]);

  if (!file && status !== 'ok') return null;

  const url = file?.url || assetUrl(`api/km_audio/file/${id}?language=${language}`);
  return <AudioPlayer file={file} url={url} name={file?.name} />;
};

export default LikutAudioPlayer;
