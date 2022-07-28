import React from 'react';
import { Button } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { isEqual } from 'lodash/lang';

import { actions, selectors as player } from '../../../redux/modules/player';
import { selectors as playlist } from '../../../redux/modules/playlist';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { canonicalLink } from '../../../helpers/links';
import ShareBarPlayer from './ShareBarPlayer';
import ShareInputCopy from './ShareInputCopy';
import StartStopButtons from './StartStopButtons';
import { getUrl } from './helper';

const ShareFormDesktop = ({ t }) => {
  const item            = useSelector(state => playlist.getPlayed(state.playlist), isEqual);
  const cu              = useSelector(state => mdb.getDenormContentUnit(state.mdb, item.id));
  const { start, stop } = useSelector(state => player.getStartStop(state.player), isEqual);

  const url = getUrl(canonicalLink(cu), start, stop);

  const dispatch = useDispatch();
  const exit     = () => dispatch(actions.setOverMode(null));
  return (
    <div className="mediaplayer__onscreen-share">
      <Button
        className="mediaplayer__onscreen-share-back"
        content={t('player.buttons.edit-back')}
        primary
        icon="chevron left"
        onClick={exit}
      />
      <ShareBarPlayer url={url} />
      <div className="mediaplayer__onscreen-share-form">
        <div className="mediaplayer__onscreen-share-bar">
          <ShareInputCopy url={url} />
        </div>
        <StartStopButtons />
      </div>
    </div>
  );

};

export default withNamespaces()(ShareFormDesktop);
