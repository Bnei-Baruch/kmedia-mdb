import { useState, useEffect } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';

import PlayAudioIcon from '../../images/icons/PlayAudio';
import { physicalFile } from '../../helpers/utils';
import { Button } from 'semantic-ui-react';

const AudioPlayer = ({ file, name, url }) => {
  const [playing, setPlaying]     = useState(false);
  const [audioInfo, setAudioInfo] = useState(null);
  const { t }                     = useTranslation();

  const _url = file ? physicalFile(file, true) : url;
  useEffect(() => {
    const clearAudioInfo = () => {
      if (audioInfo !== null) {
        setAudioInfo(null);
        setPlaying(false);
      }
    };

    if (!_url) {
      clearAudioInfo();
    } else {
      const newAudioInfo = { url: _url, name };
      if (audioInfo?.url !== newAudioInfo.url) {
        setAudioInfo(newAudioInfo);
        setPlaying(false);
      }
    }
  }, [audioInfo, _url, name]);

  return audioInfo &&
    <span className="library-audio-player">
      {playing
        ? <audio controls src={audioInfo?.url} autoPlay={true} preload="metadata" />
        :
        <Button compact onClick={() => setPlaying(true)}>
          {t('sources-library.play-audio-file')}
          <PlayAudioIcon className="playAudioIcon" />
        </Button>
      }
    </span>;
};

export default withTranslation()(AudioPlayer);
