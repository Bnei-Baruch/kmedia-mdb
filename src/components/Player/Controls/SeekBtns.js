import React from 'react';
import { Icon } from 'semantic-ui-react';
import { stopBubbling } from '../../../helpers/utils';
import { withNamespaces } from 'react-i18next';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { getPosition, seek } from '../../../pkg/jwpAdapter';

const handleSeek = (e, pos) => {
  const nPos = getPosition() + pos;
  seek(nPos > 0 ? nPos : 0);
  stopBubbling(e);
};

export const SeekBackwardBtn = withNamespaces()(({ t }) => {
  const handleSeekBackward = e => handleSeek(e, -10);
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

export const SeekForwardBtn = withNamespaces()(({ t }) => {
  const handleSeekForward = e => handleSeek(e, 10);
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
