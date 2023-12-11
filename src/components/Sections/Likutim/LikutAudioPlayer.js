import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AudioPlayer from '../../shared/AudioPlayer';
import { mergeKiteiMakor, selectors } from '../../../redux/modules/assets';
import { assetUrl } from '../../../helpers/Api';

const LikutAudioPlayer = ({ file, id, lang }) => {
  const status   = useSelector(state => selectors.getMergeStatus(state.assets)(id, lang));
  const dispatch = useDispatch();

  useEffect(() => {
    if (!file && !status) {
      dispatch(mergeKiteiMakor({ id, lang }));
    }
  }, [file, id, lang, status, dispatch]);

  if (!file && status !== 'ok') return null;

  const url = file?.url || assetUrl(`api/km_audio/file/${id}?language=${lang}`);
  return <AudioPlayer file={file} url={url} name={file?.name} />;
};

export default LikutAudioPlayer;
