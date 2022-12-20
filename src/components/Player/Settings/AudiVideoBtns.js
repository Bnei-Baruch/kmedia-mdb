import { Button, Header, Icon } from 'semantic-ui-react';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as playlistSelectors, actions as playlistActions } from '../../../redux/modules/playlist';
import { withTranslation } from 'react-i18next';
import PlayerLanguages from './PlayerLanguages';
import { LANGUAGES, MT_VIDEO, MT_AUDIO } from '../../../helpers/consts';

const AudioVideoBtns = ({ file, t }) => {
  const { mediaType } = useSelector(state => playlistSelectors.getInfo(state.playlist));
  const dispatch      = useDispatch();

  const handleSetMediaType = x => dispatch(playlistActions.setMediaType(x));

  return (
    <div className="settings">
      <div className="settings__pane">
        <div className="settings__row">
          <Header size="tiny">Playback</Header>
          <Button.Group size="mini" inverted>
            <Button
              inverted
              value={MT_VIDEO}
              onClick={handleSetMediaType}
              content={t(`player.settings.${mediaType}`)}
              active={mediaType === MT_VIDEO}
            />
            <Button
              inverted
              onClick={handleSetMediaType}
              name={MT_AUDIO}
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
              qualityByLang[language].map(x => (
                <Button
                  inverted
                  content={x}
                  onClick={() => handleSetQuality(x)}
                  active={x === quality}
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

export default withTranslation()(AudioVideoBtns);
