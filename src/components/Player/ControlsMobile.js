import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { ShareBtn, SettingsBtn, FullscreenBtn } from './Controls/ControlBtns';
import { PrevBtn, NextBtn } from './Controls/NextPrevBtns';
import { SeekBackwardBtn, SeekForwardBtn } from './Controls/SeekBtns';
import PlayPauseBg from './Controls/PlayPauseBg';
import { Timecode } from './Controls/Timecode';
import CloseBtn from './Controls/CloseBtn';
import { PLAYER_OVER_MODES } from '../../helpers/consts';
import { useSelector } from 'react-redux';
import { selectors as player } from '../../redux/modules/player';

const ControlsMobile = ({ openOnFull }) => {

  const mode = useSelector(state => player.getOverMode(state.player));

  return (
    <div className="controls" dir="ltr">
      {
        (mode === PLAYER_OVER_MODES.share) ? (
          <div className="controls__bar">
            <div className="flex-spacer"></div>
            <CloseBtn className="controls__close" />
          </div>
        ) : (
          <div className="controls__bar">
            <div className="controls__audio">
              <Checkbox label="&#34;Audio only&#34; OFF" toggle />
            </div>

            <div className="flex-spacer"></div>

            <SettingsBtn />
            <ShareBtn />
          </div>
        )
      }

      <div className="controls__bar">
        <PrevBtn />
        <div className="flex-spacer"></div>
        <SeekBackwardBtn />
        <PlayPauseBg />
        <SeekForwardBtn />
        <div className="flex-spacer"></div>
        <NextBtn />
      </div>
      <div className="controls__bar">
        <Timecode />
        <div className="flex-spacer"></div>
        <FullscreenBtn openOnFull={openOnFull} />
      </div>
    </div>
  );
};

export default ControlsMobile;
