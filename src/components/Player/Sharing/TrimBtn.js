import React, { useContext, useState } from 'react';
import moment from 'moment/moment';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Popup } from 'semantic-ui-react';

import { ClientChroniclesContext } from '../../../helpers/app-contexts';
import { noop } from '../../../helpers/utils';
import { actions } from '../../../redux/modules/trim';
import { selectors as player } from '../../../redux/modules/player';
import { isEqual } from 'lodash/lang';
import { toHumanReadableTime } from '../../../helpers/time';

const TrimBtn = ({ t }) => {
  const [open, setOpen] = useState(false);

  const chronicles       = useContext(ClientChroniclesContext);
  const chroniclesAppend = chronicles ? chronicles.append.bind(chronicles) : noop;

  const { start, end } = useSelector(state => player.getShareStartEnd(state.player), isEqual);
  const file           = useSelector(state => player.getFile(state.player), isEqual);

  const dispatch = useDispatch();

  const handleCut = () => {
    if (start === end) return;
    const sstart = moment
      .utc(start * 1000)
      .format(start < 60 * 60 ? 'mm[m]ss[s]' : 'HH[h]mm[m]ss[s]');

    const send = moment
      .utc(end * 1000)
      .format(end < 60 * 60 ? 'mm[m]ss[s]' : 'HH[h]mm[m]ss[s]');

    dispatch(actions.trim({ sstart, send, uid: file.id }));
    chroniclesAppend('download', {
      url: file.src,
      uid: file.id,
      sstart: toHumanReadableTime(start),
      send: toHumanReadableTime(end)
    });
  };

  return (
    <Popup
      inverted
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      content={t('player.download.iconHoverText')}
      position={'top right'}
      trigger={
        <Button circular icon="download" onClick={handleCut} />
      }
    />
  );
};

export default withNamespaces()(TrimBtn);
