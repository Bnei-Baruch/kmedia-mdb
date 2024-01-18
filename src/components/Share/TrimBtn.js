import React, { useContext, useState } from 'react';
import moment from 'moment/moment';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Popup } from 'semantic-ui-react';

import { actions } from '../../redux/modules/trim';
import { ClientChroniclesContext } from '../../helpers/app-contexts';
import { toHumanReadableTime } from '../../helpers/time';
import { noop } from '../../helpers/utils';
import { MT_VIDEO, LANGUAGES } from '../../helpers/consts';
import { playerGetFileSelector, playlistGetInfoSelector, playerGetShareStartEndSelector } from '../../redux/selectors';

const TrimBtn = ({ t }) => {
  const [open, setOpen] = useState(false);

  const chronicles       = useContext(ClientChroniclesContext);
  const chroniclesAppend = chronicles ? chronicles.append.bind(chronicles) : noop;

  const { start, end: _end }             = useSelector(playerGetShareStartEndSelector);
  const file                             = useSelector(playerGetFileSelector);
  const { language, quality, mediaType } = useSelector(playlistGetInfoSelector);

  const dispatch = useDispatch();

  const end = _end === Infinity ? file.duration : _end;

  const handleCut = () => {
    if (start === end) return;
    const sstart = moment
      .utc(start * 1000)
      .format(start < 60 * 60 ? 'mm[m]ss[s]' : 'HH[h]mm[m]ss[s]');

    const send   = moment
      .utc(end * 1000)
      .format(end < 60 * 60 ? 'mm[m]ss[s]' : 'HH[h]mm[m]ss[s]');
    const params = { sstart, send, uid: file.id };
    if (file.is_hls) {
      const { lang3 } = LANGUAGES[language];
      params.audio    = lang3.toLowerCase();
      (mediaType === MT_VIDEO) && (params.video = quality.toLowerCase());
    }

    dispatch(actions.trim(params));
    chroniclesAppend('download', {
      url   : file.src,
      uid   : file.id,
      sstart: toHumanReadableTime(start),
      send  : toHumanReadableTime(end)
    });
  };

  return (
    <Popup
      inverted
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      content={t('player.download.icon-hover-text')}
      position={'top right'}
      trigger={
        <Button as="span" circular icon="download" onClick={handleCut}/>
      }
    />
  );
};

export default withTranslation()(TrimBtn);
