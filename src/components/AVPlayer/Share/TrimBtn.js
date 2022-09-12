import React, { useContext, useState } from 'react';
import moment from 'moment/moment';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button, Icon, Label, Popup } from 'semantic-ui-react';

import { ClientChroniclesContext } from '../../../helpers/app-contexts';
import { fromHumanReadableTime } from '../../../helpers/time';
import { noop } from '../../../helpers/utils';
import { actions } from '../../../redux/modules/trim';
import { MDBFile } from '../../shapes';

const TrimBtn = ({ file, sstart, send, width, t }) => {
  const [open, setOpen] = useState(false);

  const chronicles       = useContext(ClientChroniclesContext);
  const chroniclesAppend = chronicles ? chronicles.append.bind(chronicles) : noop;

  const dispatch  = useDispatch();
  const handleCut = () => {
    if (sstart === send) return;

    const start    = fromHumanReadableTime(sstart);
    const strStart = moment.utc(start.asMilliseconds())
      .format(start.hours() === 0 ? 'mm[m]ss[s]' : 'HH[h]mm[m]ss[s]');
    const end      = fromHumanReadableTime(send);
    const strEnd   = moment.utc(end.asMilliseconds())
      .format(end.hours() === 0 ? 'mm[m]ss[s]' : 'HH[h]mm[m]ss[s]');
    dispatch(actions.trim({ sstart: strStart, send: strEnd, uid: file.id }));
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

TrimBtn.propTypes = {
  file: MDBFile,
  sstart: PropTypes.string,
  send: PropTypes.string,
  width: PropTypes.number
};

export default withTranslation()(TrimBtn);
