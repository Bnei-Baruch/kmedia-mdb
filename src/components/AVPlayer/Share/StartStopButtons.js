import React from 'react';
import { Form } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { formatDuration } from '../../../helpers/utils';
import { actions, selectors } from '../../../redux/modules/player';
import { JWPLAYER_ID } from '../../../helpers/consts';

const StartStopButtons = ({ t }) => {
  const { start, stop } = useSelector(state => selectors.getStartStop(state.player));

  const dispatch = useDispatch();
  const setStart = () => {
    const pos = window.jwplayer(JWPLAYER_ID).getPosition();
    if (pos > stop) {
      dispatch(actions.playerShareStop(null));
    }

    dispatch(actions.playerShareStart(pos));
  };

  const setStop = () => {
    const pos = window.jwplayer(JWPLAYER_ID).getPosition();
    if (pos < start) {
      dispatch(actions.playerShareStart(null));
    }

    dispatch(actions.playerShareStop(pos));
  };

  return (
    <div className="mediaplayer__onscreen-share">
      <Form>
        <Form.Group widths="equal">
          <Form.Input
            value={start ? formatDuration(start) : ''}
            onClick={setStart}
            action={{
              content: t('player.buttons.start-position'),
              onClick: setStart,
              icon: 'hourglass start',
              color: 'blue',
              size: 'mini',
              compact: true,
            }}
            input={{ readOnly: true }}
            actionPosition="left"
            placeholder={t('player.buttons.click-to-set')}
          />
          <Form.Input
            value={stop ? formatDuration(stop) : ''}
            onClick={setStop}
            action={{
              content: t('player.buttons.end-position'),
              onClick: setStop,
              icon: 'hourglass end',
              color: 'blue',
              size: 'mini',
              compact: true,
            }}
            input={{ readOnly: true }}
            actionPosition="left"
            placeholder={t('player.buttons.click-to-set')}
          />
        </Form.Group>
      </Form>
    </div>
  );

};

export default withNamespaces()(StartStopButtons);
