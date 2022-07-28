import React from 'react';
import { Button } from 'semantic-ui-react';
import { actions, selectors } from '../../redux/modules/player';
import { actions as playlistActions, selectors as playlistSelectors } from '../../redux/modules/playlist';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { JWPLAYER_ID } from '../../helpers/consts';
import AVLanguage from './AVLanguage';

const PLAYER_SPEEDS    = [0.75, 1, 1.25, 1.5, 2];
const AVPlayerSettings = ({ file, t }) => {

  const rate = useSelector(state => selectors.getRate(state.player));
  const item = useSelector(state => playlistSelectors.getPlayed(state.playlist));
  const info = useSelector(state => playlistSelectors.getInfo(state.playlist));

  const dispatch = useDispatch();

  if (!item || !info || !file) return null;

  const { qualityByLang, languages } = item;
  const { quality, language, cuId }  = info;

  const handleSetSpeed   = x => window.jwplayer(JWPLAYER_ID).setPlaybackRate(x);
  const handleSetQuality = x => {
    dispatch(actions.continuePlay());
    dispatch(playlistActions.setQuality(x));
  };

  const handleClose = () => dispatch(actions.setOverMode(null));

  return (
    <div className="settings">
      <div>
        <Button icon="close" onClick={handleClose} />
      </div>
      <div>
        Speed
        <Button.Group>
          {
            PLAYER_SPEEDS.map(x => (
              <Button
                content={t(`${x}x`)}
                onClick={() => handleSetSpeed(x)}
                active={x === rate}
              />
            ))
          }
        </Button.Group>
      </div>
      <div>
        Quality

        <Button.Group>
          {
            qualityByLang[language].map(x => (
              <Button
                content={x}
                onClick={() => handleSetQuality(x)}
                active={x === quality}
              />
            ))
          }
        </Button.Group>
      </div>
      <div>
        Language

        <Button.Group>
          <AVLanguage
            languages={languages}
            selectedLanguage={file.language}
            requestedLanguage={language}
            t={t}
            cuId={cuId}
          />
        </Button.Group>
      </div>
    </div>
  );

};

export default withNamespaces()(AVPlayerSettings);
