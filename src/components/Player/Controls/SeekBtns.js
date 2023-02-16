import React from 'react';
import { Icon } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { getPosition, seek } from '../../../pkg/jwpAdapter/adapter';

const handleSeek = pos => {
  const nPos = getPosition() + pos;
  seek(nPos > 0 ? nPos : 0);
};

export const SeekBackwardBtn = withTranslation()(({ t }) => {
  const handleSeekBackward = () => handleSeek(-10);
  return (
    <WebWrapTooltip
      content={t('player.controls.rewind10')}
      trigger={
        <div className="controls__rewind" onClick={handleSeekBackward}>
          <Icon fitted size="big" name="undo" />
        </div>
      }
    />
  );
});

export const SeekForwardBtn = withTranslation()(({ t }) => {
  const handleSeekForward = () => handleSeek(10);
  return (
    <WebWrapTooltip
      content={t('player.controls.skip10')}
      trigger={
        <div className="controls__forward" onClick={handleSeekForward}>
          <Icon fitted size="big" name="redo" />
        </div>
      }
    />
  );
});
