import React, { useContext, useState } from 'react';
import moment from 'moment/moment';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';

import { actions } from '../../redux/modules/trim';
import { ClientChroniclesContext } from '../../helpers/app-contexts';
import { toHumanReadableTime } from '../../helpers/time';
import { noop } from '../../helpers/utils';
import { MT_VIDEO, LANGUAGES } from '../../helpers/consts';
import { playerGetFileSelector, playlistGetInfoSelector, playerGetShareStartEndSelector } from '../../redux/selectors';
import Icon from '../Icon';

const TrimBtn = () => {
  const { t } = useTranslation();
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
    <Popover className="relative inline-block">
      <PopoverButton
        as="span"
        className="inline-flex items-center justify-center rounded-full p-2 cursor-pointer"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={handleCut}
      >
        <Icon icon={faDownload} />
      </PopoverButton>
      {open && (
        <PopoverPanel
          static
          className="absolute z-50 bottom-full mb-1 left-1/2 -translate-x-1/2 rounded bg-gray-800 text-white shadow-lg px-2 py-1 text-xs whitespace-nowrap"
        >
          {t('player.download.icon-hover-text')}
        </PopoverPanel>
      )}
    </Popover>
  );
};

export default TrimBtn;
