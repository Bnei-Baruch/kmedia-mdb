import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { JWPLAYER_ID } from '../../../helpers/consts';
import { stopBubbling } from '../../../helpers/utils';
import { withNamespaces } from 'react-i18next';

const seek = (e, pos) => {
  const p    = window.jwplayer(JWPLAYER_ID);
  const nPos = p.getPosition() + pos;
  p.seek(nPos > 0 ? nPos : 0);
  stopBubbling(e);
};

export const SeekBackwardBtn = withNamespaces()(({ t }) => {
  const handleSeekBackward = e => seek(e, -10);
  return (
    <Popup content={t('player.controls.rewind10')} inverted size="mini" position="top center" trigger={
      <div className="controls__rewind" onClick={handleSeekBackward}>
        <Icon fitted size="big" name="undo" />
      </div>
    } />);
});

export const SeekForwardBtn = withNamespaces()(({ t }) => {

  const handleSeekForward = e => seek(e, 10);
  return (
    <Popup content={t('player.controls.skip10')} inverted size="mini" position="top center" trigger={
      <div className="controls__forward" onClick={handleSeekForward}>
        <Icon fitted size="big" name="redo" />
      </div>
    } />
  );
});
