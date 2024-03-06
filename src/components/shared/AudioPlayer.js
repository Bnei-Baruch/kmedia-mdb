import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { textPageGetMP3Selector, textPageGetFileSelector } from '../../redux/selectors';
import { CT_SOURCE } from '../../helpers/consts';

const AudioPlayer = ({ url }) => {
  const { t }                 = useTranslation();
  const [playing, setPlaying] = useState(false);

  const _url     = useSelector(textPageGetMP3Selector);
  const { type } = useSelector(textPageGetFileSelector);

  useEffect(() => () => setPlaying(false), []);

  const src = url || _url;
  if (!src) return null;
  const play = () => setPlaying(true);

  const titleKey = type === CT_SOURCE ? 'sources-library.play-audio-file' : 'sources-library.play-source';

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
          <div>
            <div onClick={play} className="text_page__audio_btn">
              <span>{t(titleKey)}</span>
              <span className="material-symbols-outlined">volume_up</span>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default AudioPlayer;
