import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { selectors as textPage } from '../../redux/modules/textPage';
import { textPageGetMP3Selector } from '../../redux/selectors';

const AudioPlayer = ({ url }) => {
  const { t }                 = useTranslation();
  const [playing, setPlaying] = useState(false);

  const _url = useSelector(textPageGetMP3Selector);

  useEffect(() => () => setPlaying(false), []);

  const src = url || _url;
  if (!src) return null;
  const play = () => setPlaying(true);
  return (
    <div className="text_page__audio no_print">
      {
        playing ? (
          <audio
            controls
            src={src}
            preload="metadata"
            autoPlay={true}
          />
        ) : (
          <div className="text_page__audio_btn" onClick={play}>
            <span>
              {t('sources-library.play-audio-file')}
            </span>
            <span className="material-symbols-outlined">
                volume_up
            </span>
          </div>
        )
      }
    </div>
  );
};

export default AudioPlayer;
