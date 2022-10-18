import { Button, Header, Icon } from 'semantic-ui-react';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors, actions } from '../../../redux/modules/player';
import { selectors as playlistSelectors, actions as playlistActions } from '../../../redux/modules/playlist';
import { withNamespaces } from 'react-i18next';
import PlayerLanguages from './PlayerLanguages';
import { LANGUAGES, PLAYER_OVER_MODES, MT_VIDEO, MT_AUDIO } from '../../../helpers/consts';

const PLAYER_SPEEDS = [0.75, 1, 1.25, 1.5, 2];
const Settings      = ({ t }) => {

  const rate = useSelector(state => selectors.getRate(state.player));
  const file = useSelector(state => selectors.getFile(state.player));
  const item = useSelector(state => playlistSelectors.getPlayed(state.playlist));
  const info = useSelector(state => playlistSelectors.getInfo(state.playlist));

  const dispatch = useDispatch();

  if (!item || !info || !file) return null;

  const { qualityByLang }                = item;
  const { quality, language, mediaType } = info;

  const handleSetSpeed = x => window.jwplayer().setPlaybackRate(x);

  const handleSetQuality = x => {
    dispatch(actions.continuePlay());
    dispatch(playlistActions.setQuality(x));
  };

  const handleSetMediaType = x => {
    dispatch(actions.continuePlay());
    dispatch(playlistActions.setMediaType(x));
  };

  const handleOpenLangs = () => dispatch(actions.setOverMode(PLAYER_OVER_MODES.languages));

  return (
    <div className="settings">
      <div className="settings__pane">
        <div className="settings__row">
          <Header size="tiny">Playback</Header>
          <Button.Group size="mini" inverted>
            <Button
              inverted
              onClick={handleSetMediaType}
              value={MT_VIDEO}
              key={MT_VIDEO}
              content="Video"
              active={mediaType === MT_VIDEO}
            />
            <Button
              inverted
              onClick={handleSetMediaType}
              name={MT_AUDIO}
              key={MT_AUDIO}
              content="Audio"
              active={mediaType === MT_AUDIO}
            />
          </Button.Group>
        </div>
        <div className="settings__row">
          <Header size="tiny">Playback speed</Header>
          <Button.Group size="mini" inverted>

            {
              PLAYER_SPEEDS.map(x => {
                const content = x !== 1 ? `${x}x` : t('normal');
                return (
                  <Button
                    inverted
                    content={content}
                    onClick={() => handleSetSpeed(x)}
                    active={x === rate}
                    key={x}
                  />
                );
              })
            }
          </Button.Group>
        </div>
        <div className="settings__row">
          <Header size="tiny">Quality</Header>
          <Button.Group size="mini" inverted>
            {
              qualityByLang[language]?.map((x, i) => (
                <Button
                  inverted
                  content={x}
                  onClick={() => handleSetQuality(x)}
                  active={x === quality}
                  key={`${x}_${i}`}
                />
              ))
            }
          </Button.Group>
        </div>
        <div className="settings__row">
          <Header size="tiny">Language</Header>
          <Button.Group size="mini" inverted>
            <Button inverted onClick={handleOpenLangs}>
              {LANGUAGES[file.language]?.name}
              <Icon name="right chevron" />
            </Button>
          </Button.Group>
        </div>
      </div>
      <PlayerLanguages />
    </div>
  );
};

export default withNamespaces()(Settings);
