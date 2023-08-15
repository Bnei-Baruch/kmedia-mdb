import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AudioPlayer from '../../shared/AudioPlayer';
import { actions, selectors } from '../../../redux/modules/assets';
import { assetUrl } from '../../../helpers/Api';

const LikutAudioPlayer = ({ mp3, id, lang }) => {
  const status   = useSelector(state => selectors.getMergeStatus(state.assets)(id, lang));
  const dispatch = useDispatch();

  useEffect(() => {
    if (!mp3 && !status) {
      dispatch(actions.mergeKiteiMAkor({ id, lang }));
    }
  }, [mp3, id, lang, status]);

  if (!mp3 && status !== 'ok') return null;

  const url = mp3 || assetUrl(`api/km_audio/file/${id}?language=${lang}`);
  return <AudioPlayer mp3={url} />;
};

export default LikutAudioPlayer;
