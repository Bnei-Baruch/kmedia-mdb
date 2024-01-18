import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AudioPlayer from '../../shared/AudioPlayer';
import { actions as assetsActions } from '../../../redux/modules/assets';
import { assetUrl } from '../../../helpers/Api';
import { assetsGetMergeStatusSelector } from '../../../redux/selectors';

const LikutAudioPlayer = ({ file, id, lang }) => {
  const status   = useSelector(assetsGetMergeStatusSelector)(id, lang);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!file && !status) {
      dispatch(assetsActions.mergeKiteiMakor({ id, lang }));
    }
  }, [file, id, lang, status]);

  if (!file && status !== 'ok') return null;

  const url = file?.url || assetUrl(`api/km_audio/file/${id}?language=${lang}`);
  return <AudioPlayer file={file} url={url} name={file?.name}/>;
};

export default LikutAudioPlayer;
