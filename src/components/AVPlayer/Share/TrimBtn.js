import React, { useContext, useState, useMemo } from 'react';
import moment from 'moment/moment';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon, Label, Popup } from 'semantic-ui-react';

import { ClientChroniclesContext } from '../../../helpers/app-contexts';
import { noop } from '../../../helpers/utils';
import { actions } from '../../../redux/modules/trim';
import { findPlayedFile } from '../helper';
import { selectors as playlist } from '../../../redux/modules/playlist';
import { selectors as player } from '../../../redux/modules/player';
import { isEqual } from 'lodash/lang';

const TrimBtn = ({ width, t }) => {
  const [open, setOpen] = useState(false);

  const chronicles       = useContext(ClientChroniclesContext);
  const chroniclesAppend = chronicles ? chronicles.append.bind(chronicles) : noop;

  const { start, stop } = useSelector(state => player.getStartStop(state.player), isEqual);
  const info            = useSelector(state => playlist.getInfo(state.playlist), isEqual);
  const item            = useSelector(state => playlist.getPlayed(state.playlist), isEqual);
  const file            = useMemo(() => findPlayedFile(item, info), [item, info]);

  const dispatch = useDispatch();

  const handleCut = () => {
    if (start === stop) return;
    const _start = moment.duration(start);
    const sstart = moment
      .utc(_start.asMilliseconds())
      .format(start.hours() === 0 ? 'mm[m]ss[s]' : 'HH[h]mm[m]ss[s]');

    const _stop = moment.duration(stop);
    const send  = moment
      .utc(_stop.asMilliseconds())
      .format(_stop.hours() === 0 ? 'mm[m]ss[s]' : 'HH[h]mm[m]ss[s]');

    dispatch(actions.trim({ sstart, send, uid: file.id }));
    chroniclesAppend('download', { url: file.src, uid: file.id, sstart, send });
  };

  return (
    <Popup
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      content={t('player.download.iconHoverText')}
      position={'top right'}
      trigger={
        <Button
          circular
          onClick={handleCut}
          compact
          style={{ width: `${width}px`, height: `${width}px` }}
          size="big"
          className="cut_and_download_btn"
        >
          <Label
            color="red"
            floating
            content={t('messages.new')}
          />
          <Icon name="cloud download" />
        </Button>
      }
    />
  );
};

export default withNamespaces()(TrimBtn);
