import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';

import PlayAudioIcon from '../../images/icons/PlayAudio';
import { physicalFile } from '../../helpers/utils';


const AudioPlayer = ({ mp3, t }) => {
  const [playing, setPlaying]       = useState(false);
  const [audioInfo, setAudioInfo]   = useState(null);

  useEffect(() => {
    const clearAudioInfo = () => {
      if (audioInfo !== null) {
        setAudioInfo(null);
        setPlaying(false);
      }
    };

    if (!mp3) {
      clearAudioInfo();
    } else {
      const newAudioInfo = { url: physicalFile(mp3, true), name: mp3.name };
      if (audioInfo?.url !== newAudioInfo.url) {
        setAudioInfo(newAudioInfo);
        setPlaying(false);
      }
    }
  }, [audioInfo, mp3]);

  return audioInfo &&
    <span className="library-audio-player">
      {playing ?
        <audio controls src={audioInfo?.url} autoPlay={true} preload="metadata" /> :
        <a onClick={() => setPlaying(true)}>
          {t('sources-library.play-audio-file')}
          <PlayAudioIcon className="playAudioIcon" />
        </a>
      }
    </span>;
}

export default withNamespaces()(AudioPlayer);
